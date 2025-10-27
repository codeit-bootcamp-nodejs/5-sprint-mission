import dotenv from "dotenv";
dotenv.config();

export const BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";
export const DATABASE_URL = process.env.DATABASE_URL;
export const PORT = process.env.PORT || 3000;
export const PUBLIC_PATH = "./public";
export const STATIC_PATH = "/public";

export const API_ENDPOINTS = {
  PRODUCTS: "/products",
  ARTICLES: "/articles",
  COMMENTS: "/comments",
};
