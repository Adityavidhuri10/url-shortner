import React, { createContext, useState, useEffect, useContext } from "react";
import { getCurrentUserApi, loginUserApi, registerUserApi, logoutUserApi } from "../api/auth.api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user on mount to support persistent cookie session
    const checkAuthStatus = async () => {
        try {
            setLoading(true);
            const response = await getCurrentUserApi();
            if (response && response.success) {
                setUser(response.data.user);
            } else {
                setUser(null);
            }
        } catch (err) {
            setUser(null);
            // Don't flood console with 401 errors on initial cold-mount load
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Login handler
    const login = async (email, password) => {
        setError(null);
        try {
            const response = await loginUserApi({ email, password });
            if (response && response.success) {
                setUser(response.data.user);
                return { success: true };
            }
            return { success: false, message: response.message || "Login failed" };
        } catch (err) {
            const errMsg = err.message || "Invalid credentials. Please try again.";
            setError(errMsg);
            return { success: false, message: errMsg };
        }
    };

    // Registration handler
    const register = async (name, email, password) => {
        setError(null);
        try {
            const response = await registerUserApi({ name, email, password });
            if (response && response.success) {
                setUser(response.data.user);
                return { success: true };
            }
            return { success: false, message: response.message || "Registration failed" };
        } catch (err) {
            const errMsg = err.message || "Registration failed. Please try again.";
            setError(errMsg);
            return { success: false, message: errMsg };
        }
    };

    // Logout handler
    const logout = async () => {
        try {
            await logoutUserApi();
        } catch (err) {
            console.error("Logout error details:", err);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, isAuthenticated: !!user, login, register, logout, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
