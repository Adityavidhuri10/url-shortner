import React, { useEffect, useState } from "react";
import UrlForm from "../components/UrlForm";
import { useAuth } from "../context/AuthContext.jsx";
import { getUserUrlsApi, deleteUserUrlApi } from "../api/shortUrl.api.js";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null); // stores URL ID currently being deleted
  const [copiedId, setCopiedId] = useState(null); // stores URL ID currently copied

  const fetchUrls = async () => {
    try {
      setError("");
      const data = await getUserUrlsApi();
      setUrls(data || []);
    } catch (err) {
      console.error("Failed to load URLs:", err);
      setError("Failed to fetch your link analytics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this short URL?")) {
      return;
    }
    try {
      setDeleteLoading(id);
      await deleteUserUrlApi(id);
      setUrls(prev => prev.filter(url => url._id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete URL.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleCopyLink = async (id, shortUrl) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col relative font-sans">
      {/* Dashboard Header */}
      <header className="w-full bg-white border-b border-zinc-200/80 px-6 py-4 sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-zinc-900 rounded-lg text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.0" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
            </div>
            <span className="font-bold text-zinc-900 text-base tracking-tight">
              snapUrl
            </span>
          </div>

          {/* User Profile Info & Log out */}
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

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-8 relative z-10">
        
        {/* Creator Section */}
        <div className="w-full max-w-xl mx-auto bg-white border border-zinc-200/80 p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
              Create branded link
            </h1>
            <p className="text-xs text-zinc-500 mt-1.5 font-medium">
              Create shortened URL with custom slugs for your brand.
            </p>
          </div>

          {/* Render the url shortener form component with refresh callback */}
          <UrlForm onSuccess={fetchUrls} />
        </div>

        {/* Links List Section */}
        <div className="w-full bg-white border border-zinc-200/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-6">
            <div>
              <h2 className="text-base font-bold text-zinc-900 tracking-tight">Your Branded Links</h2>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-medium">Manage and view analytics for all your links.</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold text-zinc-700 bg-zinc-100 rounded-full">
              {urls.length} link{urls.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Loading States */}
          {loading ? (
            <div className="space-y-4 py-8">
              {[1, 2, 3].map(n => (
                <div key={n} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-zinc-100 rounded-xl animate-pulse">
                  <div className="space-y-2 flex-1 w-full">
                    <div className="h-4 bg-zinc-100 rounded w-1/3"></div>
                    <div className="h-3 bg-zinc-50 rounded w-3/4"></div>
                  </div>
                  <div className="h-8 bg-zinc-100 rounded w-20"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-4 text-center text-xs text-red-600 font-semibold bg-red-50/50 rounded-xl border border-red-100">
              {error}
            </div>
          ) : urls.length === 0 ? (
            /* Empty State */
            <div className="text-center py-14 max-w-sm mx-auto">
              <div className="inline-flex p-4 rounded-full bg-zinc-50 text-zinc-400 mb-4 border border-zinc-100">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg>
              </div>
              <h3 className="text-sm font-bold text-zinc-900">No links generated yet</h3>
              <p className="text-xs text-zinc-400 font-medium mt-1">
                Enter a long URL in the form above to create your first secure short link.
              </p>
            </div>
          ) : (
            /* Links List Grid */
            <div className="divide-y divide-zinc-100">
              {urls.map((item) => (
                <div key={item._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex-1 min-w-0 space-y-1.5">
                    {/* Shortened URL */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <a 
                        href={item.shortUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-sm font-bold text-zinc-900 hover:text-zinc-600 transition tracking-wide break-all"
                      >
                        {item.shortUrl}
                      </a>
                      {/* Click counter badge */}
                      <span className="px-2 py-0.5 text-[10px] font-semibold text-zinc-600 bg-zinc-100 rounded-full">
                        {item.clicks} click{item.clicks !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Original URL & Date */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1 text-xs text-zinc-400 font-medium">
                      <span className="truncate max-w-sm block" title={item.full_url}>
                        {item.full_url}
                      </span>
                      <span className="hidden sm:inline text-zinc-200">•</span>
                      <span>Created {formatDate(item.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopyLink(item._id, item.shortUrl)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border active:scale-[0.98] transition-all duration-150 cursor-pointer
                      ${
                        copiedId === item._id
                          ? "bg-emerald-50/50 border-emerald-200 text-emerald-700"
                          : "bg-zinc-50 border-zinc-200/60 hover:bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {copiedId === item._id ? "Copied" : "Copy"}
                    </button>
                    <button
                      disabled={deleteLoading === item._id}
                      onClick={() => handleDelete(item._id)}
                      className="p-1.5 border border-zinc-200/60 hover:border-red-200 text-zinc-500 hover:text-red-600 hover:bg-red-50/20 active:scale-[0.98] transition duration-150 rounded-xl disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                      title="Delete short link"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-zinc-200/60 text-center text-xs text-zinc-400 mt-10">
        <p>&copy; {new Date().getFullYear()} snapUrl — Stateless link redirection.</p>
      </footer>
    </div>
  );
};

export default DashboardPage;
