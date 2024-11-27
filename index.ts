import http from "http";
import handler from "serve-handler";

const server = http.createServer((req, res) => {
    return handler(req, res);
});
server.listen(3005);

const worker = new Worker("./worker.ts");
worker.addEventListener("close", () => server.close());