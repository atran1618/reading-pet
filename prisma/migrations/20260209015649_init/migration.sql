-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "petPoints" INTEGER NOT NULL DEFAULT 0,
    "todayPages" INTEGER NOT NULL DEFAULT 0,
    "todayDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeZone" TEXT NOT NULL DEFAULT 'UTC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
