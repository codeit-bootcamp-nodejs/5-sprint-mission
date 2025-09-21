export const PRODUCTS = [
    {
        id: 'b1f8b184-4f32-45e7-94fc-2c9dbfc401d7',
        name: 'Vintage T-Shirt',
        description: 'A lightly used vintage tee in good condition.',
        price: 25000,
        tags: ['Apparel', 'Electronics'],
        imageUrl: 'uploads/vintage-tshirt.jpg',
    },
    {
        id: '7a2c324e-20b1-4f30-9fd8-45bb56c5c8ce',
        name: 'Bluetooth Speaker',
        description: 'Compact and loud. Battery lasts 10 hours.',
        price: 55000,
        tags: ['Electronics'],
        imageUrl: 'uploads/bluetooth-speaker.jpg',
    },
    {
        id: 'a482cc56-1df5-4cf2-bb6b-6a6845ff8f9e',
        name: 'Handmade Vase',
        description: 'Beautiful ceramic vase from a local artisan.',
        price: 40000,
        tags: ['Home_Goods'],
        imageUrl: 'uploads/vase.jpg',
    },
    {
        id: 'e1f54d84-d23f-47fc-88f2-e765bb9d527b',
        name: 'Gucci Sunglasses',
        description: 'Authentic Gucci sunglasses in excellent condition.',
        price: 180000,
        tags: ['Luxury_Goods'],
        imageUrl: 'uploads/gucci-sunglasses.jpg',
    },
    {
        id: 'f7e4c9ab-9235-4f69-b24f-bccf6de9bc88',
        name: 'Signed Baseball',
        description: 'Signed by a famous player, collector’s item.',
        price: 300000,
        tags: ['Collectibles'],
        imageUrl: 'uploads/signed-baseball.jpg',
    }
];


export const ARTICLES = [
    {
        id: '911d4fa2-1a8f-4d6d-a96a-bb73ae54e2e1',
        title: 'How to Clean Vintage Clothing',
        content: 'Vintage clothing requires special care. Here are some tips...',
    },
    {
        id: '3cb6eec7-6b25-4eb8-98ec-e7e9479f3d17',
        title: 'Best Gadgets in 2025',
        content: 'This year saw the release of several innovative gadgets...',
    },
    {
        id: '35aebf8b-7a4f-4051-90e8-c6e9cfef6fd8',
        title: 'Decorating Your Home on a Budget',
        content: 'You don’t need a big budget to make your home look great...',
    }
];


export const COMMENTS = [
    // Comments for Products
    {
        id: '01c05e80-3b44-4e6f-8ec7-4f8c9e214f8a',
        content: 'Is the t-shirt still available?',
        productId: 'b1f8b184-4f32-45e7-94fc-2c9dbfc401d7'
    },
    {
        id: '98b4b871-117f-4e0c-a15d-59c2f04e3254',
        content: 'Can you do 50,000 for the speaker?',
        productId: '7a2c324e-20b1-4f30-9fd8-45bb56c5c8ce'
    },
    {
        id: 'd94f80d9-fb2c-4cd7-87ce-9a0e859b5e4b',
        content: 'I’ll buy the vase if you include shipping.',
        productId: 'a482cc56-1df5-4cf2-bb6b-6a6845ff8f9e'
    },

    // Comments for Articles
    {
        id: 'b5f2dc8e-df06-47e2-bfd2-6bfa33f1a4b1',
        content: 'Thanks for the cleaning tips!',
        articleId: '911d4fa2-1a8f-4d6d-a96a-bb73ae54e2e1'
    },
    {
        id: 'cb942688-3b3c-4d16-9097-13d5d8082b8e',
        content: 'I love my new smart ring, totally agree.',
        articleId: '3cb6eec7-6b25-4eb8-98ec-e7e9479f3d17'
    },
    {
        id: '0dbb837e-84c4-4c26-80e4-ec618c5f7e95',
        content: 'This helped me redecorate my living room!',
        articleId: '35aebf8b-7a4f-4051-90e8-c6e9cfef6fd8'
    }
];
