import React from 'react';
import UrlForm from '../components/UrlForm';
import { useAuth } from '../context/AuthContext.jsx';

const HomePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col relative font-sans">
      
      {/* Clean Dashboard Header */}
      <header className="w-full bg-white border-b border-zinc-200/80 px-6 py-4 sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-zinc-900 rounded-lg text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.0" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
            </div>
            <span className="font-bold text-zinc-900 text-base tracking-tight">
              shortify.
            </span>
          </div>

          {/* User Section & Logout action */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5">
                <img 
                  src={user.avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp"} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full border border-zinc-200 object-cover shadow-sm bg-zinc-100"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-zinc-800 leading-tight">{user.name}</p>
                  <p className="text-[10px] text-zinc-500 leading-tight">{user.email}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="px-3 py-1.5 border border-zinc-200 hover:bg-zinc-50 active:scale-[0.98] text-zinc-600 hover:text-zinc-900 rounded-xl text-xs font-semibold tracking-wide transition duration-150 ease-in-out cursor-pointer"
              >
                Log Out
              </button>
            </div>
          )}

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-lg bg-white border border-zinc-200/80 p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
              Create short link
            </h1>
            <p className="text-xs text-zinc-500 mt-1.5 font-medium">
              Generate stateless, signed, and secure links instantly.
            </p>
          </div>

          {/* Render the url shortener form component */}
          <UrlForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-zinc-100 text-center text-xs text-zinc-400">
        <p>&copy; {new Date().getFullYear()} shortify. Stateless link redirection.</p>
      </footer>
    </div>
  );
};

export default HomePage;