/*
  Warnings:

  - You are about to drop the column `keycloakId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TwoFactorAuth` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "TwoFactorAuth" DROP CONSTRAINT "TwoFactorAuth_userId_fkey";

-- DropIndex
DROP INDEX "User_keycloakId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "keycloakId";
ALTER TABLE "User" ADD COLUMN     "password" STRING NOT NULL;

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "TwoFactorAuth";
