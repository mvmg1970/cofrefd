import { connect } from "node:tls";
import type { AddressInfo } from "node:net";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createMutualTlsServer } from "../../src/application/identity/mtls-transport";

const mtlsDir = process.env.COFREDF_MTLS_DIR;

describe("real mutual TLS transport", () => {
  it("accepts a client certificate signed by the trusted CA", async () => {
    if (!mtlsDir) throw new Error("COFREDF_MTLS_DIR is required");

    const server = createMutualTlsServer({
      keyPath: `${mtlsDir}/server.key`,
      certificatePath: `${mtlsDir}/server.crt`,
      caPath: `${mtlsDir}/ca.crt`,
    });

    await new Promise<void>((resolve, reject) => {
      server.listen(0, "127.0.0.1", resolve).once("error", reject);
    });

    try {
      const address = server.address() as AddressInfo;
      const response = await new Promise<string>((resolve, reject) => {
        const socket = connect({
          host: "127.0.0.1",
          port: address.port,
          ca: readCertificate(mtlsDir, "ca.crt"),
          cert: readCertificate(mtlsDir, "client.crt"),
          key: readCertificate(mtlsDir, "client.key"),
          rejectUnauthorized: true,
          servername: "localhost",
        });
        let body = "";
        socket.on("data", (chunk) => { body += chunk.toString(); });
        socket.on("end", () => resolve(body));
        socket.on("error", reject);
      });

      expect(response).toBe("mTLS-ok");
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  it("rejects a client without a certificate", async () => {
    if (!mtlsDir) throw new Error("COFREDF_MTLS_DIR is required");

    const server = createMutualTlsServer({
      keyPath: `${mtlsDir}/server.key`,
      certificatePath: `${mtlsDir}/server.crt`,
      caPath: `${mtlsDir}/ca.crt`,
    });

    await new Promise<void>((resolve, reject) => {
      server.listen(0, "127.0.0.1", resolve).once("error", reject);
    });

    try {
      const address = server.address() as AddressInfo;
      const response = await new Promise<string>((resolve) => {
        const socket = connect({
          host: "127.0.0.1",
          port: address.port,
          ca: readCertificate(mtlsDir, "ca.crt"),
          rejectUnauthorized: true,
          servername: "localhost",
        });
        let body = "";
        let settled = false;
        const finish = () => {
          if (!settled) {
            settled = true;
            resolve(body);
          }
        };
        socket.on("data", (chunk) => { body += chunk.toString(); });
        socket.on("error", finish);
        socket.on("end", finish);
        socket.on("close", finish);
      });

      expect(response).toBe("");
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });
});

function readCertificate(directory: string, name: string): Buffer {
  return readFileSync(`${directory}/${name}`);
}
