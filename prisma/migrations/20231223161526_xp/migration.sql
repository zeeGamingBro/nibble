-- AlterTable
ALTER TABLE "GuildMember" ADD COLUMN     "exp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "GuildModules" ADD COLUMN     "serverExp" BOOLEAN NOT NULL DEFAULT false;