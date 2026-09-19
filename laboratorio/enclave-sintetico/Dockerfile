FROM amazonlinux@sha256:74c545e3e04db388b00bd31d7cc5640d4e9c12058a6d72af938d113da3c82893

# A imagem final deve ser fixada por digest antes do build oficial.
RUN dnf install -y python3 python3-pip && dnf clean all
RUN python3 -m pip install --no-cache-dir --disable-pip-version-check cbor2==5.6.5 cryptography==43.0.3

WORKDIR /app
COPY app.py nsm_client.py attestation_verifier.py kmstool_enclave_cli libnsm.so /app/

USER 1000:1000
ENTRYPOINT ["python3", "/app/app.py"]
