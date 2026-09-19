"""Minimal NSM client for the synthetic Nitro Enclave probe.

The attestation document is requested only inside the enclave.  The probe
never sends the document contents to the parent; it reports only length and a
local SHA-256 digest for lab evidence.
"""

from __future__ import annotations

import ctypes
import hashlib
import os
from typing import Optional

try:
    import cbor2
except ImportError:  # The host-side unit tests do not need the dependency.
    cbor2 = None


NSM_IOCTL_MAGIC = 0x0A
NSM_RESPONSE_MAX_SIZE = 0x3000


class NSMUnavailable(RuntimeError):
    """The NSM device or its CBOR dependency is unavailable."""


class NsmMessage(ctypes.Structure):
    _fields_ = [
        ("request_base", ctypes.c_void_p),
        ("request_len", ctypes.c_size_t),
        ("response_base", ctypes.c_void_p),
        ("response_len", ctypes.c_size_t),
    ]


def get_attestation_document(
    *,
    device_path: str = "/dev/nsm",
    user_data: Optional[bytes] = None,
    nonce: Optional[bytes] = None,
) -> bytes:
    """Request a signed attestation document from the enclave's NSM."""

    if cbor2 is None:
        raise NSMUnavailable("cbor2 is not installed")
    try:
        import fcntl
    except ImportError as error:
        raise NSMUnavailable("NSM requires a POSIX host") from error
    if not os.path.exists(device_path):
        raise NSMUnavailable("NSM device is unavailable")

    params = {}
    if user_data is not None:
        params["user_data"] = user_data
    if nonce is not None:
        params["nonce"] = nonce

    request = cbor2.dumps({"Attestation": params})
    request_buffer = ctypes.create_string_buffer(request)
    response_buffer = ctypes.create_string_buffer(NSM_RESPONSE_MAX_SIZE)
    message = NsmMessage(
        ctypes.cast(request_buffer, ctypes.c_void_p),
        len(request),
        ctypes.cast(response_buffer, ctypes.c_void_p),
        NSM_RESPONSE_MAX_SIZE,
    )
    ioctl_request = (3 << 30) | (NSM_IOCTL_MAGIC << 8) | (ctypes.sizeof(message) << 16)

    with open(device_path, "rb+", buffering=0) as device:
        fcntl.ioctl(device.fileno(), ioctl_request, message)

    response = cbor2.loads(response_buffer.raw[: message.response_len])
    if "Error" in response:
        raise RuntimeError(f"NSM error: {response['Error']}")
    document = response.get("Attestation", {}).get("document")
    if not isinstance(document, bytes):
        raise RuntimeError("NSM response did not contain an attestation document")
    return document


def attestation_summary(document: bytes) -> str:
    """Return sanitized evidence without exposing the signed document."""

    return f"ATTESTATION_DOCUMENT length={len(document)} sha256={hashlib.sha256(document).hexdigest()}"
