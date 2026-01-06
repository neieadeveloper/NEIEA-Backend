import SocialEmbed from '../models/SocialEmbed.js';
import ErrorResponse from '../utils/errorResponse.js';

const allowedDomains = ['youtube.com', 'youtu.be', 'facebook.com', 'fb.com', 'instagram.com', 'instagr.am'];

const isValidEmbedUrl = (url) => {
  try {
    const parsed = new URL(url);
    return allowedDomains.some((domain) => parsed.hostname.includes(domain));
  } catch (err) {
    return false;
  }
};

// Normalize YouTube URLs to embed format
const normalizeYouTubeUrl = (url) => {
  try {
    // Already in embed format
    if (url.includes('/embed/')) return url;

    const parsed = new URL(url);

    // youtube.com/watch?v=ID
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }

    // youtu.be/ID
    if (parsed.hostname.includes('youtu.be')) {
      const videoId = parsed.pathname.split('/')[1];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  } catch (err) {
    return url;
  }
};

export const createSocialEmbed = async (req, res, next) => {
  try {
    const { type, url, page = 'home', section = '', position = 0, isActive = true } = req.body;

    if (!type || !url) {
      return next(new ErrorResponse('type and url are required', 400));
    }

    const normalizedType = String(type).toLowerCase();
    if (!['youtube', 'facebook', 'instagram'].includes(normalizedType)) {
      return next(new ErrorResponse('Invalid embed type', 400));
    }

    if (!isValidEmbedUrl(url)) {
      return next(new ErrorResponse('Only youtube.com, facebook.com, or instagram.com links are allowed', 400));
    }

    // Normalize YouTube URLs
    let processedUrl = url.trim();
    if (normalizedType === 'youtube') {
      processedUrl = normalizeYouTubeUrl(processedUrl);
    }

    const embed = await SocialEmbed.create({
      type: normalizedType,
      url: processedUrl,
      page: page || 'home',
      section: String(section).trim(),
      position: Number.isFinite(Number(position)) ? Number(position) : 0,
      isActive: Boolean(isActive),
    });

    res.status(201).json({ success: true, data: embed });
  } catch (error) {
    next(error);
  }
};

export const updateSocialEmbed = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.type) {
      const normalizedType = String(updates.type).toLowerCase();
      if (!['youtube', 'facebook', 'instagram'].includes(normalizedType)) {
        return next(new ErrorResponse('Invalid embed type', 400));
      }
      updates.type = normalizedType;
    }

    if (updates.url && !isValidEmbedUrl(updates.url)) {
      return next(new ErrorResponse('Only youtube.com, facebook.com, or instagram.com links are allowed', 400));
    }

    if (typeof updates.position !== 'undefined') {
      updates.position = Number.isFinite(Number(updates.position)) ? Number(updates.position) : 0;
    }

    const embed = await SocialEmbed.findById(id);
    if (!embed) {
      return next(new ErrorResponse('Social embed not found', 404));
    }

    // Normalize YouTube URLs
    if (updates.url && embed.type === 'youtube') {
      updates.url = normalizeYouTubeUrl(updates.url);
    } else if (updates.type === 'youtube' && updates.url) {
      updates.url = normalizeYouTubeUrl(updates.url);
    }

    Object.assign(embed, updates);
    await embed.save();

    res.status(200).json({ success: true, data: embed });
  } catch (error) {
    next(error);
  }
};

export const deleteSocialEmbed = async (req, res, next) => {
  try {
    const { id } = req.params;

    const embed = await SocialEmbed.findById(id);
    if (!embed) {
      return next(new ErrorResponse('Social embed not found', 404));
    }

    await embed.deleteOne();

    res.status(200).json({ success: true, message: 'Social embed deleted' });
  } catch (error) {
    next(error);
  }
};

export const getSocialEmbeds = async (req, res, next) => {
  try {
    const { page, isActive } = req.query;

    const query = {};
    if (page) query.page = page;

    if (typeof isActive !== 'undefined') {
      if (String(isActive).toLowerCase() !== 'all') {
        query.isActive = ['true', '1', 'yes'].includes(String(isActive).toLowerCase());
      }
    } else {
      query.isActive = true; // default for public consumption
    }

    const embeds = await SocialEmbed.find(query)
      .sort({ position: 1, createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, data: embeds });
  } catch (error) {
    next(error);
  }
};

export const toggleSocialEmbedStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive === 'undefined') {
      return next(new ErrorResponse('isActive is required', 400));
    }

    const embed = await SocialEmbed.findById(id);
    if (!embed) {
      return next(new ErrorResponse('Social embed not found', 404));
    }

    embed.isActive = Boolean(isActive);
    await embed.save();

    res.status(200).json({ success: true, data: embed });
  } catch (error) {
    next(error);
  }
};
