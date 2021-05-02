-- CreateTable
CREATE TABLE `heart` (
    `user_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
UNIQUE INDEX `heart.user_id_unique`(`user_id`),
UNIQUE INDEX `heart.product_id_unique`(`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `heart` ADD FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `heart` ADD FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
