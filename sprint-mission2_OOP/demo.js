export default class Demo{
    #articlescreen;
    #productscreen;

    constructor(articlescreen, productscreen){
        this.#articlescreen = articlescreen;
        this.#productscreen = productscreen;
    }

    async run(){
        await this.#articlescreen.demonstrate();
        await this.#productscreen.demonstrate();
    }
}