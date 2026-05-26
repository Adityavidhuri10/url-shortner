import ShortUrl from '../Models/shortUrl.model.js';

export const saveShortUrl = async (shortUrl, longUrl, userId) => {
    const newUrl = new ShortUrl({
        full_url: longUrl,
        short_url: shortUrl
    });

    if (userId) {
        newUrl.user = userId;
    }

    return await newUrl.save();
};

export const getShortUrl = async (shortUrl) => {
    return await ShortUrl.findOneAndUpdate(
        { short_url: shortUrl },
        { $inc: { clicks: 1 } },
        { new: true }
    ).exec();
};

export const findShortUrlByCode = async (shortUrl) => {
    return await ShortUrl.findOne({ short_url: shortUrl }).exec();
};

export const findShortUrlsByUser = async (userId) => {
    return await ShortUrl.find({ user: userId }).sort({ createdAt: -1 }).exec();
};

export const deleteShortUrlById = async (id, userId) => {
    return await ShortUrl.findOneAndDelete({ _id: id, user: userId }).exec();
};