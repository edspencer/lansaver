-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Backup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jobId" INTEGER,
    "deviceId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "bytes" INTEGER,
    CONSTRAINT "Backup_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Backup_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Backup" ("bytes", "createdAt", "deviceId", "id", "status", "updatedAt") SELECT "bytes", "createdAt", "deviceId", "id", "status", "updatedAt" FROM "Backup";
DROP TABLE "Backup";
ALTER TABLE "new_Backup" RENAME TO "Backup";
PRAGMA foreign_key_check("Backup");
PRAGMA foreign_keys=ON;
