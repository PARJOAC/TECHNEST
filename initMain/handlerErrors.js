const { access, writeFile, readFile, mkdir } = require("fs").promises;
const path = require("path");
const proceso = require("process");

const logDir = path.join(__dirname, "logs");
const logFile = path.join(logDir, "errorLogs.json");

module.exports = async () => {
  console.log("Error service started.");

  try {
    await mkdir(logDir, { recursive: true });

    try {
      await access(logFile);
    } catch {
      await writeFile(logFile, JSON.stringify([], null, 2), "utf8");
    }
  } catch (error) {
    console.error(`Failed to create log directory: ${error.message}`);
  }

  const logError = async (type, error) => {
    const logEntry = {
      type,
      timestamp: new Date().toLocaleString("es-ES", {
        timeZone: "Europe/Madrid",
      }),
      message: error.message || error,
      stack: error.stack || "No stack trace available",
    };

    try {
      const existingLogs = await readFile(logFile, "utf8").catch(() => "[]");
      let logs;

      try {
        logs = JSON.parse(existingLogs);
        if (!Array.isArray(logs)) {
          throw new Error("Log file does not contain an array.");
        }
      } catch {
        console.warn("Log file corrupted, resetting to an empty array.");
        logs = [];
      }

      logs.push(logEntry);

      await writeFile(logFile, JSON.stringify(logs, null, 2), "utf8");
      console.log(`Logged ${type} to errorLogs.json.`);
    } catch (writeError) {
      console.error(`Failed to write to log file: ${writeError.message}`);
    }
  };

  proceso.on("unhandledRejection", (reason) => {
    logError(
      "unhandledRejection",
      reason instanceof Error ? reason : new Error(reason)
    );
  });

  proceso.on("uncaughtException", (error) => {
    logError("uncaughtException", error);
  });

};
