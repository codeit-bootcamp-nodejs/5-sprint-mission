CREATE TABLE `User` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NULL,
    `nickname` VARCHAR(30) NOT NULL,
    `refreshToken` TEXT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`)
);

CREATE TABLE `Tag` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL UNIQUE,
	PRIMARY KEY(`id`)
);

CREATE TABLE `SocialAccount` (
    `provider` VARCHAR(50) NOT NULL,
    `providerId` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `userId` INT NOT NULL,
    PRIMARY KEY (`userId`, `provider`),
    UNIQUE (`provider`, `providerId`),
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE
);

CREATE TABLE `Product` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(30) NOT NULL,
    `description` VARCHAR(500) NOT NULL,
    `price` INT NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `userId` INT NOT NULL,
	PRIMARY KEY(`id`),
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE
);

CREATE TABLE `ProductImage` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `imageUrl` TEXT NOT NULL,
    `order` INT NOT NULL,
    `productId` INT NOT NULL,
	PRIMARY KEY(`id`),
    FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE
);

CREATE TABLE `ProductTag` (
    `productId` INT NOT NULL,
    `tagId` INT NOT NULL,
    PRIMARY KEY (`productId`, `tagId`),
    FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE RESTRICT
);

CREATE TABLE `ProductComment` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(150) NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `userId` INT NOT NULL,
    `productId` INT NOT NULL,
	PRIMARY KEY(`id`),
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE
);

CREATE TABLE `ProductLike` (
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `userId` INT NOT NULL,
    `productId` INT NOT NULL,
    PRIMARY KEY (`userId`, `productId`),
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE
);

CREATE TABLE `Article` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(30) NOT NULL,
    `content` VARCHAR(500) NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `userId` INT NOT NULL,
	PRIMARY KEY(`id`),
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE
);

CREATE TABLE `ArticleImage` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `imageUrl` TEXT NOT NULL,
    `order` INT NOT NULL,
    `articleId` INT NOT NULL,
	PRIMARY KEY(`id`),
    FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE CASCADE
);

CREATE TABLE `ArticleComment` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(150) NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `userId` INT NOT NULL,
    `articleId` INT NOT NULL,
	PRIMARY KEY(`id`),
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE CASCADE
);

CREATE TABLE `ArticleLike` (
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `userId` INT NOT NULL,
    `articleId` INT NOT NULL,
    PRIMARY KEY (`userId`, `articleId`),
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE CASCADE
);
