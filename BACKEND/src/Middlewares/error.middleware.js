import ApiError from "../utils/ApiError.js";

/**
 * Centralized Error Middleware
 * Catches all errors thrown inside asyncHandlers and formats them into standardized JSON ApiError responses.
 */
const errorMiddleware = (err, req, res, next) => {
    // In development, log the full error stack trace for debugging
    if (process.env.NODE_ENV === "development") {
        console.error("Centralized Error Handler Log:", err);
    }

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let success = err.success ?? false;
    let errors = err.errors || [];

    // 1. Handle custom ApiError instances directly
    if (err instanceof ApiError) {
        return res.status(statusCode).json({
            success,
            statusCode,
            message,
            errors,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined
        });
    }

    // 2. Handle MongoDB Duplicate Key Error (11000)
    if (err.code === 11000) {
        statusCode = 409;
        // Parse duplicate keys from error message
        const duplicateField = Object.keys(err.keyValue || {})[0] || "field";
        message = `A record with this ${duplicateField} already exists.`;
    }

    // 3. Handle MongoDB ValidationError (Mongoose Validation)
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Validation Error";
        errors = Object.values(err.errors).map(val => val.message);
    }

    // 4. Handle JWT Expiry Error
    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Your token has expired. Please authenticate again.";
    }

    // 5. Handle Malformed JWT signature
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid auth token. Access denied.";
    }

    // Send the standardized JSON error response
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
};

export default errorMiddleware;