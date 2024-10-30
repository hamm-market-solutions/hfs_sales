import { createServer } from "http";
import { parse } from "url";

import next from "next";
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });
  const socketPath = process.env.PORT;

  if (socketPath && socketPath.startsWith("/")) {
    server.listen(socketPath, () => {
      console.log(`> Ready on socket ${socketPath}`);
    });
  } else {
    const portNumber = socketPath || 3000;
    server.listen(portNumber, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${portNumber}`);
    });
  }
});
