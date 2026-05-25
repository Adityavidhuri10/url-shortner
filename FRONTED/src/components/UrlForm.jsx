import { useState } from "react";
import { createShortUrl } from "../api/shortUrl.api.js";

const UrlForm = () => {
  const [url, setUrl] = useState("https://www.google.com");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("handleSubmit triggered! Input URL:", url);

    setLoading(true);
    setError("");

    try {
      console.log("Sending request to backend via createShortUrl...");

      const response = await createShortUrl(url);

      console.log("Received response from backend:", response);

      setShortUrl(response);

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
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Enter your URL
        </label>

        <input
          id="url"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com/long-url"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-4 rounded-md text-white transition duration-300
        ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Generating..." : "Shorten URL"}
      </button>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md">
          {error}
        </div>
      )}

      {shortUrl && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">
            Your Shortened URL:
          </h2>

          <div className="flex items-center">
            <input
              type="text"
              readOnly
              value={shortUrl}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md bg-gray-100 focus:outline-none"
            />

            <button
              type="button"
              onClick={handleCopy}
              className={`px-4 py-2 rounded-r-md transition-colors duration-200
              ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
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