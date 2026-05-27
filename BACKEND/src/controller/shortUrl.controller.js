import { createShortUrlWithSlug } from "../services/shortUrl.service.js";
import { getShortUrl, findShortUrlsByUser, deleteShortUrlById } from "../dao/shortUrl.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

export const createShortUrl = asyncHandler(async (req, res) => {
  const { url, customSlug } = req.body;

  if (!url) {
    throw new ApiError(400, "URL is required");
  }

  // Optionally extract authenticated user from token
  let userId = null;
  const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
  if (token) {
    try {
      if (!process.env.JWT_SECRET) {
        throw new ApiError(500, "JWT secret key is missing in server environment");
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded?._id;
    } catch (err) {
      if (customSlug) {
        throw new ApiError(401, "Invalid or expired session. Please log in again.");
      }
    }
  }

  // Verify that only authenticated users can create custom slugs
  if (customSlug && !userId) {
    throw new ApiError(401, "Login to create custom short links.");
  }

  const shortUrl = await createShortUrlWithSlug(url, customSlug, userId);

  // Dynamically determine the base URL of the backend server
  const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}/`;

  res.status(201).json({
    success: true,
    shortUrl: baseUrl + shortUrl.short_url,
  });
});

export const redirectFromShortUrl = asyncHandler(async (req, res) => {
  const { shortUrl } = req.params;

  const url = await getShortUrl(shortUrl);

  if (!url) {
    throw new ApiError(404, "Short URL not found");
  }

  return res.redirect(url.full_url);
});

export const getUserUrls = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized access: Missing user credentials");
  }

  const urls = await findShortUrlsByUser(req.user._id);

  // Dynamically determine the base URL of the backend server
  const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}/`;

  res.status(200).json({
    success: true,
    data: urls.map(url => ({
      _id: url._id,
      full_url: url.full_url,
      shortUrl: baseUrl + url.short_url,
      clicks: url.clicks,
      createdAt: url.createdAt
    }))
  });
});

export const deleteUrl = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized access: Missing user credentials");
  }

  const { id } = req.params;
  const deletedUrl = await deleteShortUrlById(id, req.user._id);

  if (!deletedUrl) {
    throw new ApiError(404, "Short URL not found or you are not authorized to delete it");
  }

  res.status(200).json({
    success: true,
    message: "Short URL deleted successfully"
  });
});