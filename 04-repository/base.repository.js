export class BaseRepository { 
    
    prisma

    constructor(prisma){
        this.prisma = prisma;
    }

    findAll(){
        throw Error("findAll 메서드를 정의해주세요");
    }

    save(){
        throw Error("save 메서드를 정의해주세요");
    }

    
    findById(id){
        throw Error("findById 메서드를 정의해주세요");
    }
}