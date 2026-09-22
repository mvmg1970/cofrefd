import { readFileSync } from "node:fs";
import { createServer, type Server } from "node:tls";
import { CertificateRegistry } from "./certificate-registry";

export type MutualTlsServerOptions = Readonly<{
  keyPath: string;
  certificatePath: string;
  caPath: string;
  certificateRegistry?: CertificateRegistry;
  clientServiceId?: string;
}>;

export function createMutualTlsServer(options: MutualTlsServerOptions): Server {
  const server = createServer({
    key: readFileSync(options.keyPath),
    cert: readFileSync(options.certificatePath),
    ca: readFileSync(options.caPath),
    requestCert: true,
    rejectUnauthorized: true,
    minVersion: "TLSv1.3",
  });

  server.on("secureConnection", (socket) => {
    if (options.certificateRegistry && options.clientServiceId) {
      const fingerprint = socket.getPeerCertificate().fingerprint256;
      if (!fingerprint || !options.certificateRegistry.isActive(options.clientServiceId, fingerprint)) {
        socket.destroy();
        return;
      }
    }

    socket.end("mTLS-ok");
  });

  return server;
}
