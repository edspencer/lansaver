import { createLogger, format, transports, Logger } from "winston";
import path from "path";
import fs from "fs";
import { Writable } from "stream";

// Ensure the log directory exists
const logDirectory = process.env.LOGS_DIRECTORY || path.join(process.cwd(), "logs");
fs.mkdirSync(logDirectory, { recursive: true });

export const createJobLogger = (jobId: number): Logger => {
  const logFilePath = logLocationForJob(jobId);

  return createLogger({
    level: "info",
    format: format.combine(
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [new transports.Console(), new transports.File({ filename: logFilePath })],
  });
};

export const createBackupLogger = (backupId: number, jobLogger?: Logger): Logger => {
  const logFilePath = logLocationForBackup(backupId);
  const loggerTransports: any[] = [new transports.Console(), new transports.File({ filename: logFilePath })];

  if (jobLogger) {
    // Create a writable stream that writes to the job logger
    const jobLogStream = new Writable({
      write(chunk, encoding, callback) {
        jobLogger.info(chunk.toString().trim());
        callback();
      },
    });

    loggerTransports.push(new transports.Stream({ stream: jobLogStream }));
  }

  return createLogger({
    level: "info",
    format: format.combine(
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: loggerTransports,
  });
};

export function logLocationForJob(jobId: number): string {
  return path.join(logDirectory, `job_${jobId}.log`);
}

export function logLocationForBackup(backupId: number): string {
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

export async function getJobLogs(jobId: string): Promise<string> {
  const logFilePath = path.join(process.cwd(), "logs", `job_${jobId}.log`);
  try {
    return fs.readFileSync(logFilePath, "utf8");
  } catch (error) {
    console.error(`Failed to read log file: ${(error as Error).message}`);
    return "Failed to fetch job logs.";
  }
}
