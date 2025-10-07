// app-error.ts

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(message: string, statusCode: number, isOperational = true, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 404 Not Found Error
export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, true);
  }
}

// 400 Validation Error
export class ValidationError extends AppError {
  constructor(message = "Invalid request data", details?: any) {
    super(message, 400, true, details);
  }
}

// 401 Authentication Error
export class AuthenticationError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, true);
  }
}

// 403 Forbidden Error
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403, true);
  }
}

// 500 Database Error
export class DatabaseError extends AppError {
  constructor(message = "Database error occurred", details?: any) {
    super(message, 500, true, details);
  }
}

// 429 Rate Limiting Error
export class RateLimitError extends AppError {
  constructor(message = "Too many requests, please try again later") {
    super(message, 429, true);
  }
}
