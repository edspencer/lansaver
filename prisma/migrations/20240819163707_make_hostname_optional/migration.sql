-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Device" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "hostname" TEXT,
    "credentials" TEXT NOT NULL DEFAULT '{}',
    "config" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Device" ("config", "createdAt", "credentials", "hostname", "id", "type", "updatedAt") SELECT "config", "createdAt", "credentials", "hostname", "id", "type", "updatedAt" FROM "Device";
DROP TABLE "Device";
ALTER TABLE "new_Device" RENAME TO "Device";
PRAGMA foreign_key_check("Device");
PRAGMA foreign_keys=ON;
