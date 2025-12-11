import { DependencyInjector } from "./dependency-injector";

const { httpServer } = new DependencyInjector();

httpServer.run();
