import axiosInstance from "../utils/axiosInstance.js";

/**
 * Register a new user
 * @param {Object} userData - { name, email, password }
 * @returns {Promise<Object>} The API response data containing the created user
 */
export const registerUserApi = async (userData) => {
    const { data } = await axiosInstance.post("/api/auth/register", userData);
    return data;
};

/**
 * Login user
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} The API response data containing user info and token cookie (set automatically)
 */
export const loginUserApi = async (credentials) => {
    const { data } = await axiosInstance.post("/api/auth/login", credentials);
    return data;
};

/**
 * Logout user
 * @returns {Promise<Object>} Clears the HTTP-Only cookie and terminates session
 */
export const logoutUserApi = async () => {
    const { data } = await axiosInstance.post("/api/auth/logout");
    return data;
};

/**
 * Get current authenticated user
 * @returns {Promise<Object>} User details (name, email, avatar, etc.)
 */
export const getCurrentUserApi = async () => {
    const { data } = await axiosInstance.get("/api/auth/me");
    return data;
};
