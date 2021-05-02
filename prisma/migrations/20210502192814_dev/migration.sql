/*
  Warnings:

  - The primary key for the `heart` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `heart` DROP PRIMARY KEY,
    ADD COLUMN     `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);
