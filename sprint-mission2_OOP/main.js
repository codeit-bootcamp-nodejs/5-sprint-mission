import Demo from "./demo.js"

import ArticleService from "./service/ArticleService.js"
import ArticleDemo from "./show/article-api.demo.js"
import ArticleScreen from "./ui/article-screen.js"

import ProductService from "./service/ProductService.js"
import ProductDemo from "./show/product-api-demo.js"
import ProductScreen from "./ui/product-screen.js"




const articleService =  new ArticleService();
const articleDemo = new ArticleDemo(articleService);
const articleScreen = new ArticleScreen(articleDemo);

const productService = new ProductService();
const productDemo  = new ProductDemo(productService);
const productScreen = new ProductScreen(productDemo);

const demo = new Demo(articleScreen, productScreen);
demo.run();