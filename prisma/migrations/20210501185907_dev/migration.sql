/*
  Warnings:

  - You are about to drop the `action` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `action` DROP FOREIGN KEY `action_ibfk_1`;

-- DropForeignKey
ALTER TABLE `action` DROP FOREIGN KEY `action_ibfk_2`;

-- DropTable
DROP TABLE `action`;

-- CreateTable
CREATE TABLE `acution` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
INDEX `acution_product_fk`(`product_id`),
INDEX `acution_user_fk`(`user_id`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `acution` ADD FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `acution` ADD FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
