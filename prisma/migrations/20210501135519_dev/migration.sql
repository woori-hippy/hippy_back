/*
  Warnings:

  - You are about to drop the column `wooriToken` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `wooriToken`,
    ADD COLUMN     `woori_token` VARCHAR(191);
