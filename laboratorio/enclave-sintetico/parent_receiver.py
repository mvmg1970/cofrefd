"""Recebe, no host, a saída sanitizada do probe via vsock."""

from __future__ import annotations

import socket
import base64
import secrets


PORT = 5000
DOCUMENT_PATH = "/tmp/attestation-document.cbor.b64"


def main() -> None:
    with socket.socket(socket.AF_VSOCK, socket.SOCK_STREAM) as server:
        server.bind((socket.VMADDR_CID_ANY, PORT))
        server.listen(1)
        print(f"VSOCK_RECEIVER_LISTENING port={PORT}", flush=True)
        connection, address = server.accept()
        with connection:
            print(f"VSOCK_RECEIVER_CONNECTED cid={address[0]}", flush=True)
            nonce = secrets.token_bytes(32)
            with open("/tmp/attestation-nonce.hex", "w", encoding="ascii") as nonce_file:
                nonce_file.write(nonce.hex())
            connection.sendall(f"NONCE {nonce.hex()}\n".encode("ascii"))
            pending = ""
            while True:
                data = connection.recv(4096)
                if not data:
                    break
                pending += data.decode("utf-8", errors="replace")
                lines = pending.split("\n")
                pending = lines.pop()
                for line in lines:
                    if line.startswith("ATTESTATION_DOCUMENT_B64 "):
                        encoded = line.split(" ", 1)[1].strip()
                        base64.b64decode(encoded, validate=True)
                        with open(DOCUMENT_PATH, "w", encoding="ascii") as document:
                            document.write(encoded)
                        print("ATTESTATION_DOCUMENT_RECEIVED file=/tmp/attestation-document.cbor.b64", flush=True)
                    else:
                        print(line, flush=True)
            if pending:
                print(pending, flush=True)
        print("VSOCK_RECEIVER_DONE", flush=True)


if __name__ == "__main__":
    main()
