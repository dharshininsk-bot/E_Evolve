/*
  Warnings:

  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nodes` on the `WasteLog` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `WasteLog` table. All the data in the column will be lost.
  - Added the required column `collectorId` to the `WasteLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Transaction";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "totalWeight" REAL NOT NULL DEFAULT 0,
    "couponCode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Milestone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CONSUMER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "role", "updatedAt") SELECT "createdAt", "email", "id", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_WasteLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weight" REAL NOT NULL,
    "plasticType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'COLLECTED',
    "collectorId" TEXT NOT NULL,
    "consumerId" TEXT,
    "recyclerId" TEXT,
    "hcsSequenceNumber" TEXT,
    "htsTransactionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WasteLog_collectorId_fkey" FOREIGN KEY ("collectorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WasteLog_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "WasteLog_recyclerId_fkey" FOREIGN KEY ("recyclerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_WasteLog" ("createdAt", "id", "plasticType", "status", "updatedAt", "weight") SELECT "createdAt", "id", "plasticType", "status", "updatedAt", "weight" FROM "WasteLog";
DROP TABLE "WasteLog";
ALTER TABLE "new_WasteLog" RENAME TO "WasteLog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
