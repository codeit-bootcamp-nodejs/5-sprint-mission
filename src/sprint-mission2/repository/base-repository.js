import axios from "axios";

export default class BaseRepository {
  instance;

  constructor(basePath) {
    this.instance = axios.create({
      baseURL: `https://panda-market-api-crud.vercel.app/${basePath}`,
    });
  }
}
