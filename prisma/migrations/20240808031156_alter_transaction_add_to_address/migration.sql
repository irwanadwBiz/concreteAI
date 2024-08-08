/*
  Warnings:

  - Added the required column `toAddress` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "toAddress" TEXT NOT NULL;
