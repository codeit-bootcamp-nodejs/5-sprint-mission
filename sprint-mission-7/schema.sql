CREATE TABLE `Product` (
  `id` String PRIMARY KEY,
  `userId` String,
  `name` String,
  `description` String,
  `price` Integer,
  `tags` String[],
  `imageUrl` String,
  `isLiked` Boolean,
  `createdAt` DateTime,
  `updatedAt` DateTime
);

CREATE TABLE `Article` (
  `id` String PRIMARY KEY,
  `userId` String,
  `title` String,
  `content` String,
  `createdAt` DateTime,
  `updatedAt` DateTime
);

CREATE TABLE `ArticleComment` (
  `id` String PRIMARY KEY,
  `articleId` String,
  `content` String,
  `createdAt` DateTime,
  `updatedAt` DateTime,
  `userId` String
);

CREATE TABLE `ProductComment` (
  `id` String PRIMARY KEY,
  `productId` String,
  `content` String,
  `createdAt` DateTime,
  `updatedAt` DateTime,
  `userId` String
);

CREATE TABLE `User` (
  `id` String PRIMARY KEY,
  `email` String,
  `nickname` String,
  `image` String,
  `refreshToken` String,
  `password` String,
  `createdAt` DateTime,
  `updatedAt` DateTime
);

ALTER TABLE `Product` ADD FOREIGN KEY (`userId`) REFERENCES `User` (`id`);

ALTER TABLE `Article` ADD FOREIGN KEY (`userId`) REFERENCES `User` (`id`);

ALTER TABLE `ProductComment` ADD FOREIGN KEY (`productId`) REFERENCES `Product` (`id`);

ALTER TABLE `ArticleComment` ADD FOREIGN KEY (`articleId`) REFERENCES `Article` (`id`);
