import http from "http";
import app from "./app";
import { initSocket } from "./socket";

const PORT = Number(process.env.PORT) || 3000;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening: http://localhost:${PORT}`);
});
