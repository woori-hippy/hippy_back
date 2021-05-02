/*
  Warnings:

  - The primary key for the `heart` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `heart` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `heart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `heart` DROP PRIMARY KEY,
    DROP COLUMN `created_at`,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`user_id`, `product_id`);
