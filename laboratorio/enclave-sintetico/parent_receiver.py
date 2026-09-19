"""Recebe, no host, a saída sanitizada do probe via vsock."""

from __future__ import annotations

import socket


PORT = 5000


def main() -> None:
    with socket.socket(socket.AF_VSOCK, socket.SOCK_STREAM) as server:
        server.bind((socket.VMADDR_CID_ANY, PORT))
        server.listen(1)
        print(f"VSOCK_RECEIVER_LISTENING port={PORT}", flush=True)
        connection, address = server.accept()
        with connection:
            print(f"VSOCK_RECEIVER_CONNECTED cid={address[0]}", flush=True)
            while True:
                data = connection.recv(4096)
                if not data:
                    break
                print(data.decode("utf-8", errors="replace"), end="", flush=True)
        print("VSOCK_RECEIVER_DONE", flush=True)


if __name__ == "__main__":
    main()
