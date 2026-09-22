import { readFileSync } from "node:fs";
import { createServer, type Server } from "node:tls";

export type MutualTlsServerOptions = Readonly<{
  keyPath: string;
  certificatePath: string;
  caPath: string;
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
    socket.end("mTLS-ok");
  });

  return server;
}
