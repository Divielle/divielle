CREATE TABLE `cartItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(128) NOT NULL,
	`productId` int NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cartItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `coupons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(64) NOT NULL,
	`discountPercent` int NOT NULL,
	`active` int NOT NULL DEFAULT 1,
	`usageLimit` int,
	`usageCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `coupons_id` PRIMARY KEY(`id`),
	CONSTRAINT `coupons_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `newsletter` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`subscribedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `newsletter_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletter_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `orderItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`productName` varchar(256) NOT NULL,
	`quantity` int NOT NULL,
	`unitPrice` decimal(10,2) NOT NULL,
	CONSTRAINT `orderItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(128) NOT NULL,
	`userId` int,
	`email` varchar(320) NOT NULL,
	`fullName` varchar(256) NOT NULL,
	`address` text NOT NULL,
	`city` varchar(128) NOT NULL,
	`postalCode` varchar(20) NOT NULL,
	`country` varchar(128) NOT NULL,
	`phone` varchar(32),
	`subtotal` decimal(10,2) NOT NULL,
	`discount` decimal(10,2) DEFAULT '0',
	`total` decimal(10,2) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'EUR',
	`couponCode` varchar(64),
	`status` enum('pending','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(128) NOT NULL,
	`name` varchar(256) NOT NULL,
	`series` enum('lipstick','lip-gloss','palette','brushes') NOT NULL,
	`description` text,
	`longDescription` text,
	`priceEur` decimal(10,2) NOT NULL,
	`stock` int NOT NULL DEFAULT 0,
	`imageUrl` text,
	`ingredients` text,
	`features` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`userId` int,
	`authorName` varchar(128) NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
