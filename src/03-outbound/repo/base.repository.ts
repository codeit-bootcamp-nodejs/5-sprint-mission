import { PrismaClient } from "@prisma/client/extension";

export class BaseRepository { 
    
    prisma

    constructor(prisma: PrismaClient){
        this.prisma = prisma;
    }
}