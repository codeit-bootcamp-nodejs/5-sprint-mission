export const USERS = [
  {
    id: "u1",
    email: "user1@example.com",
    nickname: "UserOne",
    password: "$2b$10$abcdefghijk1234567890", // 예시 bcrypt hash
  },
  {
    id: "u2",
    email: "user2@example.com",
    nickname: "UserTwo",
    password: "$2b$10$mnopqrstuvwxyz123456", // 예시 bcrypt hash
  },
];

export const PRODUCTS = [
  {
    id: "b1f8b184-4f32-45e7-94fc-2c9dbfc401d7",
    name: "Vintage T-Shirt",
    description: "A lightly used vintage tee in good condition.",
    price: 25000,
    tags: ["Apparel", "Electronics"],
    imageUrl: "uploads/vintage-tshirt.jpg",
    userId: "u1",
  },
  {
    id: "7a2c324e-20b1-4f30-9fd8-45bb56c5c8ce",
    name: "Bluetooth Speaker",
    description: "Compact and loud. Battery lasts 10 hours.",
    price: 55000,
    tags: ["Electronics"],
    imageUrl: "uploads/bluetooth-speaker.jpg",
    userId: "u2",
  },
  {
    id: "a482cc56-1df5-4cf2-bb6b-6a6845ff8f9e",
    name: "Handmade Vase",
    description: "Beautiful ceramic vase from a local artisan.",
    price: 40000,
    tags: ["Home_Goods"],
    imageUrl: "uploads/vase.jpg",
    userId: "u1",
  },
];

export const ARTICLES = [
  {
    id: "911d4fa2-1a8f-4d6d-a96a-bb73ae54e2e1",
    title: "How to Clean Vintage Clothing",
    content: "Vintage clothing requires special care. Here are some tips...",
    userId: "u1",
  },
  {
    id: "3cb6eec7-6b25-4eb8-98ec-e7e9479f3d17",
    title: "Best Gadgets in 2025",
    content: "This year saw the release of several innovative gadgets...",
    userId: "u2",
  },
];

export const COMMENTS = [
  // Comments for Products
  {
    id: "01c05e80-3b44-4e6f-8ec7-4f8c9e214f8a",
    content: "Is the t-shirt still available?",
    productId: "b1f8b184-4f32-45e7-94fc-2c9dbfc401d7",
    userId: "u2",
  },
  {
    id: "98b4b871-117f-4e0c-a15d-59c2f04e3254",
    content: "Can you do 50,000 for the speaker?",
    productId: "7a2c324e-20b1-4f30-9fd8-45bb56c5c8ce",
    userId: "u1",
  },
  // Comments for Articles
  {
    id: "b5f2dc8e-df06-47e2-bfd2-6bfa33f1a4b1",
    content: "Thanks for the cleaning tips!",
    articleId: "911d4fa2-1a8f-4d6d-a96a-bb73ae54e2e1",
    userId: "u2",
  },
  {
    id: "cb942688-3b3c-4d16-9097-13d5d8082b8e",
    content: "I love my new smart ring, totally agree.",
    articleId: "3cb6eec7-6b25-4eb8-98ec-e7e9479f3d17",
    userId: "u1",
  },
];
