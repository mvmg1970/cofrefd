"""Probe sintético de rede para execução dentro de um Nitro Enclave.

Não processa dados reais, não usa credenciais e não envia conteúdo protegido.
"""

from __future__ import annotations

import socket
import base64
from typing import Iterable, Optional

from nsm_client import NSMUnavailable, attestation_summary, get_attestation_document


TARGETS: tuple[tuple[str, int], ...] = (
    ("example.com", 80),
    ("example.com", 443),
    ("169.254.169.254", 80),
)

PARENT_CID = 3
PARENT_PORT = 5000


class VsockReporter:
    def __init__(self) -> None:
        self._socket: Optional[socket.socket] = None
        vsock_family = getattr(socket, "AF_VSOCK", None)
        if vsock_family is None:
            return
        try:
            self._socket = socket.socket(vsock_family, socket.SOCK_STREAM)
            self._socket.settimeout(3)
            self._socket.connect((PARENT_CID, PARENT_PORT))
            challenge = self._socket.recv(128).decode("ascii").strip()
            if not challenge.startswith("NONCE "):
                raise OSError("invalid parent challenge")
            self.nonce = bytes.fromhex(challenge.split(" ", 1)[1])
        except OSError:
            self._socket = None
            self.nonce = None

    def send(self, message: str) -> None:
        line = f"{message}\n".encode("utf-8", errors="replace")
        if self._socket is None:
            print(message, flush=True)
            return
        try:
            self._socket.sendall(line)
        except OSError:
            print(message, flush=True)

    def close(self) -> None:
        if self._socket is not None:
            self._socket.close()

    def send_document(self, document: bytes) -> None:
        if self._socket is None:
            return
        encoded = base64.b64encode(document).decode("ascii")
        self._socket.sendall(f"ATTESTATION_DOCUMENT_B64 {encoded}\n".encode("ascii"))


def probe_dns(report: VsockReporter) -> None:
    try:
        results = socket.getaddrinfo("example.com", 443, type=socket.SOCK_STREAM)
        families = sorted({item[0].name for item in results})
        report.send(f"DNS example.com: resolvido; families={','.join(families)}")
    except OSError as error:
        report.send(f"DNS example.com: bloqueado/indisponivel; error={type(error).__name__}")


def probe_tcp(report: VsockReporter, targets: Iterable[tuple[str, int]]) -> None:
    for host, port in targets:
        try:
            with socket.create_connection((host, port), timeout=3):
                report.send(f"TCP {host}:{port}: conectado")
        except OSError as error:
            report.send(f"TCP {host}:{port}: bloqueado/indisponivel; error={type(error).__name__}")


def probe_attestation(report: VsockReporter) -> None:
    try:
        document = get_attestation_document(nonce=report.nonce)
        report.send(attestation_summary(document))
        report.send_document(document)
    except (NSMUnavailable, OSError, RuntimeError) as error:
        report.send(f"ATTESTATION_DOCUMENT indisponivel; error={type(error).__name__}")


def main() -> None:
    report = VsockReporter()
    try:
        report.send("ENCLAVE_PROBE classification=laboratorio-sintetico debug=false")
        probe_dns(report)
        probe_tcp(report, TARGETS)
        probe_attestation(report)
        report.send("ENCLAVE_PROBE_DONE")
    finally:
        report.close()


if __name__ == "__main__":
    main()
