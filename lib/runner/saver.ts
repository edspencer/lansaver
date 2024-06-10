const fs = require("fs");
const path = require("path");

//this chiefly exists to satisfy SOLID and remove duplicate file writing code
//from the runners
export default class BackupSaver {
  backupDirectory: string;

  constructor(backupDirectory: string) {
    this.backupDirectory = backupDirectory;

    if (!backupDirectory) {
      console.error("Backup directory not set");
      throw new Error("Backup directory not set");
    }

    // Create backups directory if it doesn't exist
    try {
      fs.mkdirSync(backupDirectory, { recursive: true });
    } catch (error: any) {
      console.error(`Failed to create backup directory: ${error.message}`);
    }
  }

  async save(filename: string, data: string) {
    const filePath = path.join(this.backupDirectory, filename);
    console.log(`Writing backup to ${filePath}`);

    fs.writeFileSync(filePath, data);
  }

  async size(filename: string) {
    const filePath = path.join(this.backupDirectory, filename);

    const stats = fs.statSync(filePath);

    return stats.size;
  }
}
