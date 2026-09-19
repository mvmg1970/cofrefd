"""Probe sintético de rede para execução dentro de um Nitro Enclave.

Não processa dados reais, não usa credenciais e não envia conteúdo protegido.
"""

from __future__ import annotations

import socket
import base64
import hashlib
import json
import os
import subprocess
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
            challenge = self._socket.recv(8192).decode("ascii").splitlines()
            nonce_line = next((line for line in challenge if line.startswith("NONCE ")), "")
            if not nonce_line:
                raise OSError("invalid parent challenge")
            self.nonce = bytes.fromhex(nonce_line.split(" ", 1)[1])
            credentials_line = next(
                (line for line in challenge if line.startswith("KMS_CREDENTIALS ")), ""
            )
            self.kms_credentials = None
            if credentials_line and credentials_line != "KMS_CREDENTIALS unavailable":
                encoded = credentials_line.split(" ", 1)[1]
                self.kms_credentials = json.loads(
                    base64.b64decode(encoded, validate=True).decode("ascii")
                )
            key_line = next((line for line in challenge if line.startswith("KMS_KEY_ID ")), "")
            self.kms_key_id = key_line.split(" ", 1)[1].strip() if key_line else None
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


def probe_kms_generate_data_key(report: VsockReporter) -> None:
    """Run only the synthetic KMS GenerateDataKey check when credentials arrive."""
    credentials = getattr(report, "kms_credentials", None)
    key_id = getattr(report, "kms_key_id", None)
    if not credentials or not key_id:
        report.send("KMS_GENERATE_DATA_KEY skipped=inputs_not_provided")
        return

    try:
        command = [
            "/app/kmstool_enclave_cli",
            "genkey",
            "--region", os.environ.get("AWS_REGION", "us-east-1"),
            "--proxy-port", "8000",
            "--aws-access-key-id", credentials["AccessKeyId"],
            "--aws-secret-access-key", credentials["SecretAccessKey"],
            "--aws-session-token", credentials["Token"],
            "--key-id", key_id,
            "--key-spec", "AES-256",
        ]
        result = subprocess.run(
            command,
            check=True,
            capture_output=True,
            text=True,
            env={**os.environ, "LD_LIBRARY_PATH": "/app"},
            timeout=15,
        )
        encoded = next(
            line.split(":", 1)[1].strip()
            for line in result.stdout.splitlines()
            if line.startswith("PLAINTEXT:")
        )
        plaintext = base64.b64decode(encoded, validate=True)
        report.send(
            "KMS_GENERATE_DATA_KEY "
            f"status=ok bytes={len(plaintext)} "
            f"sha256={hashlib.sha256(plaintext).hexdigest()}"
        )
    except (KeyError, OSError, subprocess.SubprocessError, ValueError, StopIteration) as error:
        if isinstance(error, subprocess.CalledProcessError):
            stderr = (error.stderr or "").lower()
            if "accessdenied" in stderr or "access denied" in stderr:
                category = "access_denied"
            elif "credential" in stderr or "security token" in stderr:
                category = "credentials"
            elif "proxy" in stderr or "connection" in stderr or "tls" in stderr:
                category = "connectivity"
            elif "nsm" in stderr or "attestation" in stderr:
                category = "attestation"
            else:
                category = "tool_error"
            report.send(
                f"KMS_GENERATE_DATA_KEY status=failed error=CalledProcessError "
                f"category={category} returncode={error.returncode}"
            )
        else:
            report.send(f"KMS_GENERATE_DATA_KEY status=failed error={type(error).__name__}")


def main() -> None:
    report = VsockReporter()
    try:
        report.send("ENCLAVE_PROBE classification=laboratorio-sintetico debug=false")
        probe_dns(report)
        probe_tcp(report, TARGETS)
        probe_attestation(report)
        probe_kms_generate_data_key(report)
        report.send("ENCLAVE_PROBE_DONE")
    finally:
        report.close()


if __name__ == "__main__":
    main()
