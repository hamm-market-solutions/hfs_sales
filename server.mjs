import { createServer } from "http";
import { parse } from "url";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);

        // Check if the request is not secure (http) and redirect to https
        if (!dev && process.env.APP_HOST !== "localhost" && req.headers["x-forwarded-proto"] !== "https") {
            res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
            res.end();
            return;
        }

        handle(req, res, parsedUrl);
    });

    const socketPath = process.env.PORT;

    if (socketPath && socketPath.startsWith("/")) {
        server.listen(socketPath, () => {
            console.log(`> Ready on socket ${socketPath} in ${dev ? "dev" : "prod"}`);
        });
    } else {
        const portNumber = socketPath || 3000;
        server.listen(portNumber, (err) => {
            if (err) throw err;
            console.log(`> Ready on http://localhost:${portNumber} in ${dev ? "dev" : "prod"}`);
        });
    }
});
