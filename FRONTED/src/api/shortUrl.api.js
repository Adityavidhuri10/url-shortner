import axiosInstance from "../utils/axiosInstance";

export const createShortUrl = async (url, customSlug) => {
  const payload = { url };
  if (customSlug) {
    payload.customSlug = customSlug;
  }
  const { data } = await axiosInstance.post(
    "/api/create",
    payload
  );

  return data.shortUrl;
};

export const getUserUrlsApi = async () => {
  const { data } = await axiosInstance.get("/api/create");
  return data.data;
};

export const deleteUserUrlApi = async (id) => {
  const { data } = await axiosInstance.delete(`/api/create/${id}`);
  return data;
};