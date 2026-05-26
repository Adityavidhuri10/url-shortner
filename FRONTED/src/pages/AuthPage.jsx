import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const AuthPage = ({ setView }) => {
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    
    // Form input states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    // UI states
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Form submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");
        setSubmitting(true);

        if (isLogin) {
            if (!email || !password) {
                setErrorMsg("All fields are required.");
                setSubmitting(false);
                return;
            }
            const res = await login(email, password);
            if (res.success) {
                setSuccessMsg("Welcome back! Redirecting...");
            } else {
                setErrorMsg(res.message || "Failed to log in.");
                setSubmitting(false);
            }
        } else {
            if (!name || !email || !password) {
                setErrorMsg("All fields are required.");
                setSubmitting(false);
                return;
            }
            if (password.length < 6) {
                setErrorMsg("Password must be at least 6 characters.");
                setSubmitting(false);
                return;
            }
            const res = await register(name, email, password);
            if (res.success) {
                setSuccessMsg("Account created successfully! Redirecting...");
            } else {
                setErrorMsg(res.message || "Failed to create account.");
                setSubmitting(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 relative font-sans">
            {/* Pristine Modern Light Card */}
            <div className="w-full max-w-md bg-white border border-zinc-200/80 p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] relative z-10 transition-all duration-300">
                {/* Back Navigation Trigger */}
                {setView && (
                  <button
                    onClick={() => setView("landing")}
                    className="absolute top-6 left-6 text-zinc-400 hover:text-zinc-700 transition flex items-center gap-1 text-xs font-semibold cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back
                  </button>
                )}
                
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex p-2.5 rounded-xl bg-zinc-100 mb-4 text-zinc-800">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.0" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
                        {isLogin ? "Welcome to snapUrl" : "Create your account"}
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1.5 font-medium">
                        {isLogin ? "Enter your details to manage your links" : "Get started with clean, stateless URL shortening"}
                    </p>
                </div>

                {/* Status Messages */}
                {errorMsg && (
                    <div className="mb-6 p-3 rounded-xl bg-red-50/50 border border-red-200/60 text-red-700 text-xs flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                        <span className="font-medium">{errorMsg}</span>
                    </div>
                )}

                {successMsg && (
                    <div className="mb-6 p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/60 text-emerald-800 text-xs flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="font-medium">{successMsg}</span>
                    </div>
                )}

                {/* Forms */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Aditya"
                                className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-900 text-sm placeholder-zinc-400 transition-all duration-200 outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-100"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-900 text-sm placeholder-zinc-400 transition-all duration-200 outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-100"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-900 text-sm placeholder-zinc-400 transition-all duration-200 outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-100"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98] text-white font-semibold text-sm rounded-xl transition duration-150 ease-in-out shadow-sm focus:outline-none disabled:opacity-50 disabled:pointer-events-none mt-4 cursor-pointer"
                    >
                        {submitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Please wait...
                            </span>
                        ) : (
                            isLogin ? "Sign In" : "Get Started"
                        )}
                    </button>
                </form>

                {/* Footer Switch */}
                <div className="mt-6 pt-5 border-t border-zinc-100 text-center text-xs text-zinc-500">
                    {isLogin ? (
                        <p>
                            Don't have an account?{" "}
                            <button
                                onClick={() => {
                                    setIsLogin(false);
                                    setErrorMsg("");
                                    setSuccessMsg("");
                                }}
                                className="font-semibold text-zinc-900 hover:underline cursor-pointer"
                            >
                                Register
                            </button>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{" "}
                            <button
                                onClick={() => {
                                    setIsLogin(true);
                                    setErrorMsg("");
                                    setSuccessMsg("");
                                }}
                                className="font-semibold text-zinc-900 hover:underline cursor-pointer"
                            >
                                Log in
                            </button>
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AuthPage;
