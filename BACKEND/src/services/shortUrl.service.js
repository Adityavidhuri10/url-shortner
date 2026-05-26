import { generateNanoId } from "../utils/helper.js";
import { findShortUrlByCode, saveShortUrl } from "../dao/shortUrl.js";
import validator from "validator";
import ApiError from "../utils/ApiError.js";

export const createShortUrlWithoutUser = async (url) => {
   if (!url) {
      throw new ApiError(400, "URL is required");
   }

   if (!validator.isURL(url)) {
      throw new ApiError(400, "Invalid URL");
   }

   let shortUrl;
   let existing = null;
   let attempts = 0;
   const maxAttempts = 3;

   // Handle duplicate nanoid collisions properly by retrying
   while (attempts < maxAttempts) {
      shortUrl = generateNanoId(7);
      existing = await findShortUrlByCode(shortUrl);
      if (!existing) {
         break;
      }
      attempts++;
   }

   if (existing) {
      throw new ApiError(409, "Short URL collision occurred");
   }

   await saveShortUrl(shortUrl, url);

   return {
      short_url: shortUrl
   };
};

export const createShortUrlWithUser = async (url, userId) => {
   if (!url) {
      throw new ApiError(400, "URL is required");
   }

   if (!validator.isURL(url)) {
      throw new ApiError(400, "Invalid URL");
   }

   let shortUrl;
   let existing = null;
   let attempts = 0;
   const maxAttempts = 3;

   // Handle duplicate nanoid collisions properly by retrying
   while (attempts < maxAttempts) {
      shortUrl = generateNanoId(7);
      existing = await findShortUrlByCode(shortUrl);
      if (!existing) {
         break;
         
      }
      attempts++;
   }

   if (existing) {
      throw new ApiError(409, "Short URL collision occurred");
   }

   await saveShortUrl(shortUrl, url, userId);

   return {
      short_url: shortUrl
   };
};

export const createShortUrlWithSlug = async (url, customSlug, userId = null) => {
   if (!url) {
      throw new ApiError(400, "URL is required");
   }

   if (!validator.isURL(url)) {
      throw new ApiError(400, "Invalid URL");
   }

   let shortUrl;
   if (customSlug) {
      // Validate custom slug format (letters, numbers, and hyphens)
      const slugRegex = /^[a-zA-Z0-9-]+$/;
      if (!slugRegex.test(customSlug)) {
         throw new ApiError(400, "Custom slug can only contain letters, numbers, and hyphens");
      }

      // Check if custom slug is already used
      const existing = await findShortUrlByCode(customSlug);
      if (existing) {
         throw new ApiError(409, "Custom slug is already in use");
      }
      shortUrl = customSlug;
   } else {
      let existing = null;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
         shortUrl = generateNanoId(7);
         existing = await findShortUrlByCode(shortUrl);
         if (!existing) {
            break;
         }
         attempts++;
      }

      if (existing) {
         throw new ApiError(409, "Short URL collision occurred");
      }
   }

   await saveShortUrl(shortUrl, url, userId);

   return {
      short_url: shortUrl
   };
};