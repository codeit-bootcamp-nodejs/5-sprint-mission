import { Injector } from "./injector";


const { httpSever, wsServer } = new Injector();

httpSever.start();
