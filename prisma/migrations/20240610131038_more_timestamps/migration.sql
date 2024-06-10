/*
  Warnings:

  - Added the required column `updatedAt` to the `Destination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Destination" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Destination" ("details", "id", "type") SELECT "details", "id", "type" FROM "Destination";
DROP TABLE "Destination";
ALTER TABLE "new_Destination" RENAME TO "Destination";
CREATE TABLE "new_Schedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "disabled" BOOLEAN NOT NULL,
    "cron" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Schedule" ("cron", "disabled", "id", "name") SELECT "cron", "disabled", "id", "name" FROM "Schedule";
DROP TABLE "Schedule";
ALTER TABLE "new_Schedule" RENAME TO "Schedule";
CREATE TABLE "new_Device" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "credentials" TEXT,
    "config" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Device" ("config", "credentials", "hostname", "id", "type") SELECT "config", "credentials", "hostname", "id", "type" FROM "Device";
DROP TABLE "Device";
ALTER TABLE "new_Device" RENAME TO "Device";
PRAGMA foreign_key_check("Destination");
PRAGMA foreign_key_check("Schedule");
PRAGMA foreign_key_check("Device");
PRAGMA foreign_keys=ON;
