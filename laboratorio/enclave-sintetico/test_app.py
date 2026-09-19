import io
import unittest
from contextlib import redirect_stdout
from unittest.mock import patch

import app
import nsm_client


class FakeVsock:
    def __init__(self, *_args, **_kwargs):
        self.sent = []
        self.connected_to = None
        self.timeout = None
        self.closed = False

    def settimeout(self, value):
        self.timeout = value

    def connect(self, address):
        self.connected_to = address

    def recv(self, _size):
        return b"NONCE " + (b"ab" * 32) + b"\n"

    def sendall(self, payload):
        self.sent.append(payload)

    def close(self):
        self.closed = True


class VsockReporterTests(unittest.TestCase):
    def test_connects_to_parent_and_sends_sanitized_line(self):
        fake = FakeVsock()
        with patch.object(app.socket, "AF_VSOCK", 40, create=True):
            with patch.object(app.socket, "socket", return_value=fake):
                reporter = app.VsockReporter()
                reporter.send("probe ok")
                reporter.close()

        self.assertEqual(fake.connected_to, (app.PARENT_CID, app.PARENT_PORT))
        self.assertEqual(fake.sent, [b"probe ok\n"])
        self.assertTrue(fake.closed)

    def test_falls_back_to_stdout_when_vsock_is_unavailable(self):
        output = io.StringIO()
        with patch.object(app.socket, "socket", side_effect=OSError("unavailable")):
            with redirect_stdout(output):
                reporter = app.VsockReporter()
                reporter.send("fallback")

        self.assertIn("fallback", output.getvalue())


class AttestationSummaryTests(unittest.TestCase):
    def test_summary_does_not_include_document_contents(self):
        summary = nsm_client.attestation_summary(b"synthetic-attestation")
        self.assertTrue(summary.startswith("ATTESTATION_DOCUMENT length="))
        self.assertNotIn("synthetic-attestation", summary)


if __name__ == "__main__":
    unittest.main()
