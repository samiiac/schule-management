export class AppError extends Error {
  constructor(message, statusCode, code, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.code = code;
    this.details = details;
  }
}

export const badRequest = (message = "Validation failed", details = null) => {
  return new AppError(message, 400, "BAD_REQUEST", details);
};

export const unauthorized = (
  message = "No authorization.Please log in",
  details = null,
) => {
  return new AppError(message, 401, "UNAUTHORIZED", details);
};

export const forbidden = (
  message = "Not enough permissions",
  details = null,
) => {
  return new AppError(message, 403, "FORBIDDEN", details);
};

export const duplicateContent = (
  message = "The content already exists.",
  details = null,
) => {
  return new AppError(message, 409, "CONTENT_EXISTS", details);
};

export const rateLimited = (message = "Too many requests.", details = null) => {
  return new AppError(message, 429, "RATE_LIMITED", details);
};

export const notFound = (message = "Content not found", details = null) => {
  return new AppError(message, 404, "NOT_FOUND", details);
};
