/*
  Warnings:

  - Added the required column `updatedAt` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Backup` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Job" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "startedAt" DATETIME,
    "finishedAt" DATETIME,
    "status" TEXT NOT NULL,
    "scheduleId" INTEGER NOT NULL,
    CONSTRAINT "Job_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Job" ("createdAt", "finishedAt", "id", "scheduleId", "startedAt", "status") SELECT "createdAt", "finishedAt", "id", "scheduleId", "startedAt", "status" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
CREATE TABLE "new_Backup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "deviceId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "bytes" INTEGER,
    CONSTRAINT "Backup_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Backup" ("bytes", "createdAt", "deviceId", "id", "status") SELECT "bytes", "createdAt", "deviceId", "id", "status" FROM "Backup";
DROP TABLE "Backup";
ALTER TABLE "new_Backup" RENAME TO "Backup";
PRAGMA foreign_key_check("Job");
PRAGMA foreign_key_check("Backup");
PRAGMA foreign_keys=ON;
