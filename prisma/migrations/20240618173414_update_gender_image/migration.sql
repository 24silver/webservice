/*
  Warnings:

  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `gender` ENUM('MALE', 'FEMALE') NOT NULL,
    ADD COLUMN `image` VARCHAR(191) NOT NULL;
