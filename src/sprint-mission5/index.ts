import { DepInjector } from "./dep-injector";


const { server } = new DepInjector();

server.start();
