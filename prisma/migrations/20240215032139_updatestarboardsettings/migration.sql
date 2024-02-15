/*
  Warnings:

  - Made the column `starboardEmoji` on table `GuildStarboardSettings` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "GuildStarboardSettings" ALTER COLUMN "starboardEmoji" SET NOT NULL;
