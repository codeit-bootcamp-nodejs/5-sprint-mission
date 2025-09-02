export default class Product {
    #name
    #description
    #price
    #tags
    #images
    #favoriteCount

    constructor(name, description, price, tags, images){
        this.#name = name;
        this.#description = description;
        this.#price = price;
        this.#tags = tags; 
        this.#images = images;
        this.#favoriteCount = 0;
    }

    favorite(){
        this.#favoriteCount += 1;
    }

    get name(){
        return this.#name;
    }

    get description(){
        return this.#description;
    }

    get price(){
        return this.#price;
    }

    get tags(){
        return this.#tags;
    }

    get images(){
        return this.#images;
    }

    showInfo(){
        console.log(`[상품명]: ${this.#name}\t[태그]: ${this.#tags}\t[제품 설명]: ${this.#description}`);
    }
}
