-- AlterTable
ALTER TABLE "GuildModules" ADD COLUMN     "starboard" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "GuildStarboardSettings" (
    "guildId" TEXT NOT NULL,
    "starboardChannel" TEXT,
    "starboardEmoji" TEXT DEFAULT '⭐',
    "starsRequired" INTEGER NOT NULL DEFAULT 3,
    "starOwnMessages" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GuildStarboardSettings_pkey" PRIMARY KEY ("guildId")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuildStarboardSettings_guildId_key" ON "GuildStarboardSettings"("guildId");
