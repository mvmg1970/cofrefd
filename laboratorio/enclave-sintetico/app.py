"""Probe sintético de rede para execução dentro de um Nitro Enclave.

Não processa dados reais, não usa credenciais e não envia conteúdo protegido.
"""

from __future__ import annotations

import socket
from typing import Iterable, Optional


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
        try:
            self._socket = socket.socket(socket.AF_VSOCK, socket.SOCK_STREAM)
            self._socket.settimeout(3)
            self._socket.connect((PARENT_CID, PARENT_PORT))
        except OSError:
            self._socket = None

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


def main() -> None:
    report = VsockReporter()
    try:
        report.send("ENCLAVE_PROBE classification=laboratorio-sintetico debug=false")
        probe_dns(report)
        probe_tcp(report, TARGETS)
        report.send("ENCLAVE_PROBE_DONE")
    finally:
        report.close()


if __name__ == "__main__":
    main()
