FROM amazonlinux:2023

# A imagem final deve ser fixada por digest antes do build oficial.
RUN dnf install -y python3-minimal && dnf clean all

WORKDIR /app
COPY app.py /app/app.py

USER 1000:1000
ENTRYPOINT ["python3", "/app/app.py"]
