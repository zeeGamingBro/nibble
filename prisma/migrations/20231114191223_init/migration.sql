-- CreateTable
CREATE TABLE "GuildMember" (
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,

    CONSTRAINT "GuildMember_pkey" PRIMARY KEY ("userId","guildId")
);

-- CreateTable
CREATE TABLE "Nickname" (
    "setAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "guildMemberUserId" TEXT,
    "guildMemberGuildId" TEXT,

    CONSTRAINT "Nickname_pkey" PRIMARY KEY ("setAt")
);

-- AddForeignKey
ALTER TABLE "Nickname" ADD CONSTRAINT "Nickname_guildMemberUserId_guildMemberGuildId_fkey" FOREIGN KEY ("guildMemberUserId", "guildMemberGuildId") REFERENCES "GuildMember"("userId", "guildId") ON DELETE SET NULL ON UPDATE CASCADE;
