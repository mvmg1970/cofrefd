"""Recebe, no host, a saída sanitizada do probe via vsock."""

from __future__ import annotations

import socket
import base64
import json
import secrets
import urllib.request


PORT = 5000
DOCUMENT_PATH = "/tmp/attestation-document.cbor.b64"
KMS_KEY_ID = "arn:aws:kms:us-east-1:242193017400:key/8ea0ed34-5d90-443a-b1de-bcdd601ec2dd"


def instance_role_credentials() -> dict[str, str]:
    token_request = urllib.request.Request(
        "http://169.254.169.254/latest/api/token",
        method="PUT",
        headers={"X-aws-ec2-metadata-token-ttl-seconds": "300"},
    )
    with urllib.request.urlopen(token_request, timeout=3) as response:
        token = response.read().decode("ascii")
    role_request = urllib.request.Request(
        "http://169.254.169.254/latest/meta-data/iam/security-credentials/",
        headers={"X-aws-ec2-metadata-token": token},
    )
    with urllib.request.urlopen(role_request, timeout=3) as response:
        role = response.read().decode("ascii").strip()
    credentials_request = urllib.request.Request(
        f"http://169.254.169.254/latest/meta-data/iam/security-credentials/{role}",
        headers={"X-aws-ec2-metadata-token": token},
    )
    with urllib.request.urlopen(credentials_request, timeout=3) as response:
        payload = json.load(response)
    return {
        "AccessKeyId": payload["AccessKeyId"],
        "SecretAccessKey": payload["SecretAccessKey"],
        "Token": payload["Token"],
    }


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
            try:
                credentials = instance_role_credentials()
                credentials_json = json.dumps(credentials, separators=(",", ":"), ensure_ascii=True)
                credential_line = f"KMS_CREDENTIALS {base64.b64encode(credentials_json.encode('ascii')).decode('ascii')}\n"
            except (OSError, KeyError, ValueError):
                credential_line = "KMS_CREDENTIALS unavailable\n"
            connection.sendall(
                f"NONCE {nonce.hex()}\n{credential_line}KMS_KEY_ID {KMS_KEY_ID}\n".encode("ascii")
            )
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
