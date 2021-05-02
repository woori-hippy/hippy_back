-- AlterTable
ALTER TABLE `heart` ADD PRIMARY KEY (`user_id`, `product_id`);

-- AlterIndex
ALTER TABLE `heart` RENAME INDEX `heart.product_id_unique` TO `heart_product_id_unique`;

-- AlterIndex
ALTER TABLE `heart` RENAME INDEX `heart.user_id_unique` TO `heart_user_id_unique`;
