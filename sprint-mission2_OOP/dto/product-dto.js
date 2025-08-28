export default class ProductDTO {
    images
    tags
    price
    description
    name
    
    constructor(images, tags, price, description, name){
        this.images = images;
        this.tags = tags;
        this.price = price;
        this.description = description;
        this.name = name;
    }  
}