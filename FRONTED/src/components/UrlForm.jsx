import { useState } from "react";
import { createShortUrl } from "../api/shortUrl.api.js";
import { useAuth } from "../context/AuthContext.jsx";

const UrlForm = ({ onSuccess }) => {
  const [url, setUrl] = useState("https://www.google.com");
  const [customSlug, setCustomSlug] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { isAuthenticated } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("handleSubmit triggered! Input URL:", url, "Custom Slug:", customSlug);

    setLoading(true);
    setError("");

    try {
      console.log("Sending request to backend via createShortUrl...");

      const response = await createShortUrl(url, isAuthenticated ? customSlug : "");

      console.log("Received response from backend:", response);

      setShortUrl(response);
      setCustomSlug(""); // Clear slug input on successful creation
      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      console.error("Error inside handleSubmit:", error);

      setError(
        error.response?.data?.message ||
        error.message ||
        "Something went wrong"
      );

    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>

      <div>
        <label
          htmlFor="url"
          className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5"
        >
          Enter your long URL
        </label>

        <input
          id="url"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com/long-url"
          required
          className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-900 text-sm placeholder-zinc-400 transition-all duration-200 outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-100"
        />
      </div>

      {/* Conditional Rendering based on Authentication State for Custom Slug */}
      {isAuthenticated ? (
        <div>
          <label
            htmlFor="customSlug"
            className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5"
          >
            Custom Slug (Optional)
          </label>

          <input
            id="customSlug"
            type="text"
            value={customSlug}
            onChange={(event) => setCustomSlug(event.target.value)}
            placeholder="Enter custom slug (optional)"
            className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-900 text-sm placeholder-zinc-400 transition-all duration-200 outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-100"
          />

          <p className="text-[10px] text-zinc-400 font-medium mt-1">
            Custom links available for logged-in users.
          </p>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-zinc-100/50 border border-zinc-200/50 text-zinc-600 text-xs flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span className="font-medium">Login to create custom short links.</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition duration-150 active:scale-[0.98] shadow-sm cursor-pointer
        ${
          loading
            ? "bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed shadow-none"
            : "bg-zinc-900 hover:bg-zinc-800 text-white"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating link...
          </span>
        ) : (
          "Shorten URL"
        )}
      </button>

      {error && (
        <div className="p-3 rounded-xl bg-red-50/50 border border-red-200/60 text-red-700 text-xs flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {shortUrl && (
        <div className="mt-6 pt-5 border-t border-zinc-100">
          <h2 className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            Your Shortened Link
          </h2>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shortUrl}
              className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-800 text-sm font-medium tracking-wide outline-none focus:border-zinc-300"
            />

            <button
              type="button"
              onClick={handleCopy}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition duration-150 active:scale-[0.98] cursor-pointer border
              ${
                copied
                  ? "bg-emerald-50/50 border-emerald-200 text-emerald-700"
                  : "bg-zinc-100 hover:bg-zinc-200/70 text-zinc-700 border-zinc-200/50"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default UrlForm;