const fs = require("fs");
const path = require("path");

const logErrorToFile = (error) => {
  const logFilePath = path.join(__dirname, "../logs/error.log");
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} - ${error.name}: ${error.message}\n`;

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) console.error("Error logging to file:", err);
  });
};

const sendErrorResponse = (res, error) => {
  // Determine the status code based on the error type
  const statusCode = error.status || 500;

  // Send error response
  res.status(statusCode).json({
    error: {
      message: error.message || "An unknown error occurred",
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    },
  });
};

const errorHandlingMiddleware = (error, req, res, next) => {
  logErrorToFile(error);

  sendErrorResponse(res, error);
};

module.exports = errorHandlingMiddleware;
