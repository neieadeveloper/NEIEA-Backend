import News from '../models/News.js';

// Create a new news item
export const createNews = async (req, res) => {
    try {
        const { title, content, image, date, isActive } = req.body;

        const newNews = new News({
            title,
            content,
            image,
            date: date || Date.now(),
            isActive: isActive !== undefined ? isActive : true
        });

        const savedNews = await newNews.save();

        res.status(201).json({
            success: true,
            data: savedNews,
            message: 'News item created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all active news items
export const getAllNews = async (req, res) => {
    try {
        // Optionally filter by isActive if query param provided, otherwise return all
        // For admin we might want all, for public we want only active. 
        // Let's support a query param.
        const filter = {};
        if (req.query.active === 'true') {
            filter.isActive = true;
        }

        const news = await News.find(filter).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: news.length,
            data: news
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update a news item
export const updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const news = await News.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'News item not found'
            });
        }

        res.status(200).json({
            success: true,
            data: news,
            message: 'News item updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete a news item
export const deleteNews = async (req, res) => {
    try {
        const { id } = req.params;
        const news = await News.findByIdAndDelete(id);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'News item not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'News item deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Upload news image
export const uploadNewsImage = async (req, res) => {
    try {
        if (!req.file || !req.file.location) {
            return res.status(400).json({
                success: false,
                message: 'No image file uploaded'
            });
        }

        const imageUrl = req.file.location;

        res.status(200).json({
            success: true,
            message: 'News image uploaded successfully',
            data: {
                imageUrl: imageUrl
            }
        });
    } catch (error) {
        console.error('Error uploading news image:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload news image',
            error: error.message
        });
    }
};
