"""Probe sintético de rede para execução dentro de um Nitro Enclave.

Não processa dados reais, não usa credenciais e não envia conteúdo protegido.
"""

from __future__ import annotations

import socket
from typing import Iterable


TARGETS: tuple[tuple[str, int], ...] = (
    ("example.com", 80),
    ("example.com", 443),
    ("169.254.169.254", 80),
)


def probe_dns() -> None:
    try:
        results = socket.getaddrinfo("example.com", 443, type=socket.SOCK_STREAM)
        families = sorted({item[0].name for item in results})
        print(f"DNS example.com: resolvido; families={','.join(families)}")
    except OSError as error:
        print(f"DNS example.com: bloqueado/indisponivel; error={type(error).__name__}")


def probe_tcp(targets: Iterable[tuple[str, int]]) -> None:
    for host, port in targets:
        try:
            with socket.create_connection((host, port), timeout=3):
                print(f"TCP {host}:{port}: conectado")
        except OSError as error:
            print(f"TCP {host}:{port}: bloqueado/indisponivel; error={type(error).__name__}")


def main() -> None:
    print("ENCLAVE_PROBE classification=laboratorio-sintetico debug=false")
    probe_dns()
    probe_tcp(TARGETS)
    print("ENCLAVE_PROBE_DONE")


if __name__ == "__main__":
    main()
