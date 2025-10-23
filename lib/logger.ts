type LogLevel = "info" | "warn" | "error" | "debug";

const REDACTED_KEYS = ["password", "token", "secret", "key", "hash", "authorization"];

function redactSecrets(obj: any): any {
  if (typeof obj !== "object" || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map(redactSecrets);
  }

  const redacted: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const keyLower = key.toLowerCase();
    if (REDACTED_KEYS.some((secret) => keyLower.includes(secret))) {
      redacted[key] = "[REDACTED]";
    } else if (typeof value === "object") {
      redacted[key] = redactSecrets(value);
    } else {
      redacted[key] = value;
    }
  }
  return redacted;
}

function log(level: LogLevel, message: string, meta?: any) {
  const timestamp = new Date().toISOString();
  const redactedMeta = meta ? redactSecrets(meta) : undefined;

  const logEntry = {
    timestamp,
    level,
    message,
    ...(redactedMeta && { meta: redactedMeta }),
  };

  const logLine = JSON.stringify(logEntry);

  switch (level) {
    case "error":
      console.error(logLine);
      break;
    case "warn":
      console.warn(logLine);
      break;
    case "debug":
      if (process.env.NODE_ENV === "development") {
        console.debug(logLine);
      }
      break;
    default:
      console.log(logLine);
  }
}

export const logger = {
  info: (message: string, meta?: any) => log("info", message, meta),
  warn: (message: string, meta?: any) => log("warn", message, meta),
  error: (message: string, meta?: any) => log("error", message, meta),
  debug: (message: string, meta?: any) => log("debug", message, meta),
};
