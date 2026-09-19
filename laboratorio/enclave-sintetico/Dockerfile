FROM amazonlinux@sha256:74c545e3e04db388b00bd31d7cc5640d4e9c12058a6d72af938d113da3c82893

# A imagem final deve ser fixada por digest antes do build oficial.
RUN dnf install -y python3 && dnf clean all

WORKDIR /app
COPY app.py /app/app.py

USER 1000:1000
ENTRYPOINT ["python3", "/app/app.py"]
