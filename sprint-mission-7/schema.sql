CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(50) NOT NULL UNIQUE,
    email         VARCHAR(100) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255),
    created_at    TIMESTAMP DEFAULT NOW(),
    updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
    id            SERIAL PRIMARY KEY,
    user_id       INT NOT NULL, name VARCHAR(100) NOT NULL, description TEXT,
    price         NUMERIC(12, 2) NOT NULL,
    image_url     TEXT[],
    tags          TEXT[],
    created_at    TIMESTAMP DEFAULT NOW(),
    updated_at    TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_product_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE posts (
    id            SERIAL PRIMARY KEY,
    user_id       INT NOT NULL,
    title         VARCHAR(150) NOT NULL,
    content       TEXT NOT NULL,
    created_at    TIMESTAMP DEFAULT NOW(),
    updated_at    TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_post_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE productcomments (
    id            SERIAL PRIMARY KEY,
    user_id       INT NOT NULL,
    product_id    INT NOT NULL,
    content       TEXT NOT NULL,
    created_at    TIMESTAMP DEFAULT NOW(),
    updated_at    TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_pc_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_pc_product FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE postcomments (
    id            SERIAL PRIMARY KEY,
    user_id       INT NOT NULL,
    post_id       INT NOT NULL,
    content       TEXT NOT NULL,
    created_at    TIMESTAMP DEFAULT NOW(),
    updated_at    TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_postc_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_postc_post FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE productlikes (
    id            SERIAL PRIMARY KEY,
    user_id       INT NOT NULL,
    product_id    INT NOT NULL,
    created_at    TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_pl_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_pl_product FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT unique_product_like UNIQUE(user_id, product_id)
);

