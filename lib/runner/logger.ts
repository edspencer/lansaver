import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";

// Ensure the log directory exists
const logDirectory = process.env.LOGS_DIRECTORY || path.join(process.cwd(), "logs");
fs.mkdirSync(logDirectory, { recursive: true });

export const createBackupLogger = (backupId: number) => {
  const logFilePath = logLocationForBackup(backupId);

  return createLogger({
    level: "info",
    format: format.combine(
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [new transports.Console(), new transports.File({ filename: logFilePath })],
  });
};

export function logLocationForBackup(backupId: number) {
  return path.join(logDirectory, `backup_${backupId}.log`);
}

export async function getBackupLogs(backupId: string): Promise<string> {
  const logFilePath = path.join(process.cwd(), "logs", `backup_${backupId}.log`);
  try {
    return fs.readFileSync(logFilePath, "utf8");
  } catch (error) {
    console.error(`Failed to read log file: ${(error as Error).message}`);
    return "Failed to fetch backup logs.";
  }
}
