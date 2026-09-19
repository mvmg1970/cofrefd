"""Offline verifier for a Nitro attestation document captured by the parent."""

from __future__ import annotations

import argparse
import base64
import datetime as dt
import hashlib
import json
from pathlib import Path

import cbor2
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.asymmetric.utils import encode_dss_signature


AWS_NITRO_ROOT_SHA256 = "641a0321a3e244efe456463195d606317ed7cdcc3c1756e09893f3c68f79bb5b"


def _verify_cert_signature(child: x509.Certificate, issuer: x509.Certificate) -> None:
    issuer.public_key().verify(
        child.signature,
        child.tbs_certificate_bytes,
        ec.ECDSA(child.signature_hash_algorithm),
    )


def verify(document: bytes, expected_pcrs: dict[str, str], expected_nonce: bytes) -> dict:
    outer = cbor2.loads(document)
    if isinstance(outer, cbor2.CBORTag):
        outer = outer.value
    protected, _unprotected, payload, signature = outer
    body = cbor2.loads(payload)
    leaf = x509.load_der_x509_certificate(body["certificate"])
    bundle = [x509.load_der_x509_certificate(cert) for cert in body.get("cabundle", [])]
    chain = [leaf, *bundle]

    for certificate in chain:
        now = dt.datetime.now(dt.timezone.utc)
        if not (certificate.not_valid_before_utc <= now <= certificate.not_valid_after_utc):
            raise ValueError("certificate outside validity period")
    for child, issuer in zip(chain, chain[1:]):
        _verify_cert_signature(child, issuer)

    root_hash = hashlib.sha256(bundle[-1].public_bytes(serialization.Encoding.DER)).hexdigest()
    if root_hash != AWS_NITRO_ROOT_SHA256:
        raise ValueError(f"unexpected Nitro root fingerprint: {root_hash}")

    sig_structure = cbor2.dumps(["Signature1", protected, b"", payload])
    if len(signature) % 2 != 0:
        raise ValueError("invalid ECDSA signature length")
    half = len(signature) // 2
    leaf.public_key().verify(
        encode_dss_signature(int.from_bytes(signature[:half], "big"), int.from_bytes(signature[half:], "big")),
        sig_structure,
        ec.ECDSA(hashes.SHA384()),
    )

    actual_pcrs = {f"PCR{int(key)}": value.hex() for key, value in body.get("pcrs", {}).items()}
    if any(actual_pcrs.get(key) != value.lower() for key, value in expected_pcrs.items()):
        raise ValueError("PCR mismatch")
    if body.get("nonce") != expected_nonce:
        raise ValueError("nonce mismatch")

    return {
        "verified": True,
        "root_sha256": root_hash,
        "module_id": body.get("module_id"),
        "timestamp": body.get("timestamp"),
        "pcrs": actual_pcrs,
        "nonce_length": len(body.get("nonce", b"")),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--document", type=Path, required=True)
    parser.add_argument("--nonce-hex", required=True)
    parser.add_argument("--expected-pcrs", type=Path, required=True)
    args = parser.parse_args()
    document = base64.b64decode(args.document.read_text(encoding="ascii"), validate=True)
    expected = json.loads(args.expected_pcrs.read_text(encoding="utf-8"))
    print(json.dumps(verify(document, expected, bytes.fromhex(args.nonce_hex)), sort_keys=True))


if __name__ == "__main__":
    main()
