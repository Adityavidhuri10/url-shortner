import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import HomePage from "./pages/HomePage.jsx";

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  // Premium loading splash screen for cold session mounts
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center relative font-sans">
        <div className="flex flex-col items-center gap-6">
          {/* Minimalist elegant spinner */}
          <div className="relative w-10 h-10">
            <svg className="animate-spin h-10 w-10 text-zinc-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-10" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
              <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-zinc-900 tracking-tight">shortify.</p>
            <p className="text-xs text-zinc-400 font-medium mt-1">Initializing secure session</p>
          </div>
        </div>
      </div>
    );
  }

  // Session authentication guard
  return isAuthenticated ? <HomePage /> : <AuthPage />;
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;