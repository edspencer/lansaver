import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";

// Ensure the log directory exists
const logDirectory = process.env.LOGS_DIRECTORY || path.join(process.cwd(), "logs");
fs.mkdirSync(logDirectory, { recursive: true });

const createBackupLogger = (backupId: number) => {
  const logFilePath = path.join(logDirectory, `backup_${backupId}.log`);

  return createLogger({
    level: "info",
    format: format.combine(
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [new transports.Console(), new transports.File({ filename: logFilePath })],
  });
};

export { createBackupLogger };
