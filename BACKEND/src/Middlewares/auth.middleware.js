import jwt from "jsonwebtoken";
import User from "../Models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Authentication Middleware
 * Verifies the stateless JWT stored in HttpOnly cookies or the Authorization Header.
 * Attaches the authenticated user to the `req.user` object.
 */
export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // 1. Extract token from either the HTTP-Only cookies OR authorization header (standard API design)
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized access: Access token is missing");
        }

        // 2. Decode and verify the token signature
        if (!process.env.JWT_SECRET) {
            throw new ApiError(500, "JWT secret key is missing in server environment");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Find the user based on decoded database ID
        const user = await User.findById(decoded?._id);

        if (!user) {
            throw new ApiError(401, "Unauthorized access: User not found");
        }

        // 4. Attach the user object to the request context (excluding sensitive fields)
        req.user = user;
        
        next();
    } catch (error) {
        // Map specific JWT exceptions to clear HTTP 401 statuses
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Unauthorized access: Token has expired, please log in again");
        }
        if (error.name === "JsonWebTokenError") {
            throw new ApiError(401, "Unauthorized access: Invalid or malformed token");
        }
        
        throw new ApiError(401, error?.message || "Unauthorized access");
    }
});
