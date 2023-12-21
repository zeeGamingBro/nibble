/*
  Warnings:

  - Made the column `name` on table `Nickname` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Nickname" ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "GuildModules" (
    "guildId" TEXT NOT NULL,
    "nicknameLogger" BOOLEAN NOT NULL DEFAULT true,
    "customRoles" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "GuildModules_pkey" PRIMARY KEY ("guildId")
);
