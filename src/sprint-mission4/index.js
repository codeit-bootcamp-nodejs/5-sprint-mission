import { DepInjector } from "./dep-injector.js";

const { server } = new DepInjector();

server.start();
