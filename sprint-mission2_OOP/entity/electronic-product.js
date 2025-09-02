import Product from "./product.js";

export default class ElectronicProduct extends Product {
    #manufacturer

    constructor(name, description, price, tags, images){
        super(name, description, price, tags, images); 
    }
}