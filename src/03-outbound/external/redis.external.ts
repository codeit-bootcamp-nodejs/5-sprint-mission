// Import ioredis.
// You can also use `import { Redis } from "ioredis"`
// if your project is a TypeScript project,
// Note that `import Redis from "ioredis"` is still supported,
// but will be deprecated in the next major version.
import Redis from "ioredis";
import { IRedisExternal } from "../../02-application/port/externals/I.redis.external";


export const RedisExternal = (): IRedisExternal => {
    const redis = new Redis({
        port: 6379,
        host: "127.0.0.1",
        username: "default",
        password: "my-top-secret",
        db: 0, // Defaults to 0
    });

    const set = async (key: string, value: string, ttl?: number) => {
        if (!ttl) {
            await redis.set(key, value);
        } else {
            await redis.set(key, value, "EX", ttl);
        }
    }

    const get = async (key: string) => {
        return await redis.get(key);
    }

    const setIfNotExist = async (
        key: string,
        data: string,
        ttl?: number,
    ): Promise<boolean> => {
        if (!ttl) {
            const res = await redis.setnx(key, data);
            if (res === 1) {
                return true;
            } else {
                return false;
            }
        } else {
            const res = await redis.set(key, data, "EX", ttl, "NX");
            if (res === "OK") {
                return true;
            } else {
                return false;
            }
        }
    }


    const remove = async (key: string): Promise<undefined> => {
        await redis.del(key);
    }


    return {
        set,
        get,
        setIfNotExist,
        remove
    }
}




