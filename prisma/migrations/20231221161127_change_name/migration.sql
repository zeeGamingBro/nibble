/*
  Warnings:

  - You are about to drop the column `customRoles` on the `GuildModules` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GuildModules" DROP COLUMN "customRoles",
ADD COLUMN     "colorRoles" BOOLEAN NOT NULL DEFAULT false;
