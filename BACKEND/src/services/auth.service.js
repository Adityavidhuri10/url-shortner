import User from "../Models/user.model.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

class AuthService {
    /**
     * Generates a signed stateless JWT Access Token
     * @param {Object} user - User document
     * @returns {string} Signed JWT
     */
    generateToken(user) {
        if (!process.env.JWT_SECRET) {
            throw new ApiError(500, "JWT secret key is missing in environment configuration");
        }
        
        return jwt.sign(
            { 
                _id: user._id, 
                email: user.email 
            }, 
            process.env.JWT_SECRET, 
            { 
                expiresIn: process.env.JWT_EXPIRES_IN || "1d" 
            }
        );
    }

    /**
     * Business logic for user registration
     */
    async registerUser({ name, email, password }) {
        if (!name || !email || !password) {
            throw new ApiError(400, "All fields (name, email, password) are required");
        }

        // Basic validation for email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new ApiError(400, "Please provide a valid email address");
        }

        if (password.length < 6) {
            throw new ApiError(400, "Password must be at least 6 characters long");
        }

        // Check if user already exists
        const existedUser = await User.findOne({ email });
        if (existedUser) {
            throw new ApiError(409, "User with this email already exists");
        }

        // Create and save new user (pre-save hook will hash the password)
        const user = await User.create({
            name,
            email,
            password
        });

        // Verify user creation
        const createdUser = await User.findById(user._id);
        if (!createdUser) {
            throw new ApiError(500, "Internal server error occurred while registering user");
        }

        // Generate access token
        const token = this.generateToken(createdUser);

        return { user: createdUser, token };
    }

    /**
     * Business logic for user login
     */
    async loginUser({ email, password }) {
        if (!email || !password) {
            throw new ApiError(400, "Email and password are required");
        }

        // Find user and explicitly select password field since it is configured with select: false
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            throw new ApiError(401, "Invalid email or password");
        }

        // Compare password using our User model instance method
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            throw new ApiError(401, "Invalid email or password");
        }

        // Retrieve user again to omit password/metadata or use toJSON directly
        const cleanUser = await User.findById(user._id);

        // Generate token
        const token = this.generateToken(cleanUser);

        return { user: cleanUser, token };
    }
}

export default new AuthService();
