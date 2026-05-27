import axiosInstance, { BACKEND_URL } from "../utils/axiosInstance";

// Helper function to dynamically build and sanitize the shortened URL
const getAbsoluteShortUrl = (shortUrl) => {
  if (!shortUrl) return "";
  
  let slug = shortUrl;
  
  // Self-heal case: If the backend returns "undefinedxxxxx" due to missing APP_URL in environment
  if (shortUrl.includes("undefined")) {
    slug = shortUrl.replace("undefined", "");
  } 
  // If backend returns a full URL, parse it to extract the short code/slug
  else if (shortUrl.includes("://")) {
    try {
      const urlObj = new URL(shortUrl);
      slug = urlObj.pathname.slice(1); // remove leading slash
    } catch (e) {
      slug = shortUrl.substring(shortUrl.lastIndexOf("/") + 1);
    }
  } 
  // If backend returns a relative URL path (e.g. "/xxxxx")
  else if (shortUrl.startsWith("/")) {
    slug = shortUrl.slice(1);
  }

  // Ensure slug has no leading/trailing slashes
  slug = slug.replace(/^\/+|\/+$/g, "");

  // Clean backendBaseUrl to prevent double-slashes
  const cleanBaseUrl = BACKEND_URL.endsWith("/") ? BACKEND_URL.slice(0, -1) : BACKEND_URL;
  return `${cleanBaseUrl}/${slug}`;
};

export const createShortUrl = async (url, customSlug) => {
  const payload = { url };
  if (customSlug) {
    payload.customSlug = customSlug;
  }
  const { data } = await axiosInstance.post(
    "/api/create",
    payload
  );

  return getAbsoluteShortUrl(data.shortUrl);
};

export const getUserUrlsApi = async () => {
  const { data } = await axiosInstance.get("/api/create");
  if (data && Array.isArray(data.data)) {
    return data.data.map(item => ({
      ...item,
      shortUrl: getAbsoluteShortUrl(item.shortUrl)
    }));
  }
  return data.data;
};

export const deleteUserUrlApi = async (id) => {
  const { data } = await axiosInstance.delete(`/api/create/${id}`);
  return data;
};