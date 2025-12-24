// Import ioredis.
// You can also use `import { Redis } from "ioredis"`
// if your project is a TypeScript project,
// Note that `import Redis from "ioredis"` is still supported,
// but will be deprecated in the next major version.

export interface IRedisExternal {
    set(key: string, value: string, ttl?: number): Promise<void>;
    setIfNotExist(key: string, data: string, ttl?: number): Promise<boolean>;
    get(key: string): Promise<string | null>;
    remove(key: string): Promise<undefined>;
}