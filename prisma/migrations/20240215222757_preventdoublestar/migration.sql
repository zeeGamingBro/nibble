-- CreateTable
CREATE TABLE "StarredMessage" (
    "messageId" TEXT NOT NULL,

    CONSTRAINT "StarredMessage_pkey" PRIMARY KEY ("messageId")
);

-- CreateIndex
CREATE UNIQUE INDEX "StarredMessage_messageId_key" ON "StarredMessage"("messageId");
