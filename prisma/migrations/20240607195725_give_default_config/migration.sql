-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Device" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "credentials" TEXT,
    "config" TEXT NOT NULL DEFAULT '{}'
);
INSERT INTO "new_Device" ("config", "credentials", "hostname", "id", "type") SELECT coalesce("config", '{}') AS "config", "credentials", "hostname", "id", "type" FROM "Device";
DROP TABLE "Device";
ALTER TABLE "new_Device" RENAME TO "Device";
PRAGMA foreign_key_check("Device");
PRAGMA foreign_keys=ON;
