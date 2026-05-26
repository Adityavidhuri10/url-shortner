import authService from "../services/auth.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Secure Cookie Configuration Builder
const getSecureCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === "production";
    
    return {
        httpOnly: true, // Crucial for XSS prevention. Cookie is inaccessible to client-side JS.
        secure: isProduction, // Forces the cookie to be transmitted only over secure HTTPS connection.
        sameSite: isProduction ? "none" : "lax", // Lax in development, None in production (if frontend/backend have different domains)
        maxAge: Number(process.env.COOKIE_EXPIRES_IN) || 86400000 // 24h fallback
    };
};

class AuthController {
    /**
     * Handles User Registration Request
     */
    register = asyncHandler(async (req, res) => {
        const { name, email, password } = req.body;

        // Delegate business logic to Service layer
        const { user, token } = await authService.registerUser({ name, email, password });

        const cookieOptions = getSecureCookieOptions();

        // Send token securely inside HTTP-Only cookie, along with standard JSON API Response
        return res
            .status(201)
            .cookie("token", token, cookieOptions)
            .json(new ApiResponse(201, { user }, "User registered successfully"));
    });

    /**
     * Handles User Login Request
     */
    login = asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        // Delegate business credentials check to Service layer
        const { user, token } = await authService.loginUser({ email, password });

        const cookieOptions = getSecureCookieOptions();

        // Send cookie and standardized JSON API Response
        return res
            .status(200)
            .cookie("token", token, cookieOptions)
            .json(new ApiResponse(200, { user }, "User logged in successfully"));
    });

    /**
     * Handles User Logout Request
     */
    logout = asyncHandler(async (req, res) => {
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        };

        // Clear JWT cookie securely by sending expired date and blank token
        return res
            .status(200)
            .clearCookie("token", cookieOptions)
            .json(new ApiResponse(200, {}, "User logged out successfully"));
    });

    /**
     * Fetches current authenticated user data (already resolved by JWT Auth Middleware)
     */
    getCurrentUser = asyncHandler(async (req, res) => {
        // req.user was securely injected by verifyJWT middleware
        return res
            .status(200)
            .json(new ApiResponse(200, { user: req.user }, "Current user retrieved successfully"));
    });
}

export default new AuthController();
