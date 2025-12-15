import http from "http";
import { createApp } from "./app";
import { attachWsServer } from "./inbound/ws";
import { registerWsHandlers } from "./inbound/ws/register";
import { inject } from "./injector";

const injected = inject();
const app = createApp(injected);
const httpServer = http.createServer(app);

attachWsServer(httpServer, (io) => registerWsHandlers(io, injected));

const PORT = injected.configUtil.parsed().PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
