import Subscribe from "../models/Subscribe.js";
import validator from 'validator';
import ErrorResponse from '../utils/errorResponse.js';

export const createSubscribe = async (req, res) => {
    try {
        const { email, firstName, lastName } = req.body;

        if (!firstName || !firstName.toString().trim()) {
            return res.status(400).json({
                success: false,
                message: "First name is required"
            });
        }

        if (!lastName || !lastName.toString().trim()) {
            return res.status(400).json({
                success: false,
                message: "Last name is required"
            });
        }

        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email ID"
            })
        }

        const alreadySubscribe = await Subscribe.findOne({email}); 

        if(alreadySubscribe) {
            return res.status(409).json({       
                success: false,
                message: "You are already subscribed!"
            });
        }

        const newContact = new Subscribe({
            email: email.trim(),
            firstName: firstName.toString().trim(),
            lastName: lastName.toString().trim(),
        });

        await newContact.save();

        return res.status(201).json({
            success: true,
            message: "Thank you for subscribing!",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get all subscribed emails (Admin only)
// @route   GET /api/admin/subscribe
// @access  Private (Admin)
export const getAllSubscribes = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const subscribes = await Subscribe.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Subscribe.countDocuments();

        res.status(200).json({
            success: true,
            data: subscribes,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        console.error("Error fetching subscribes:", error);
        next(new ErrorResponse("Server error while fetching subscribes", 500));
    }
};

// @desc    Get single subscribed email by ID (Admin only)
// @route   GET /api/admin/subscribe/:id
// @access  Private (Admin)
export const getSubscribeById = async (req, res, next) => {
    try {
        const subscribe = await Subscribe.findById(req.params.id);

        if (!subscribe) {
            return next(new ErrorResponse("Subscribe not found", 404));
        }

        res.status(200).json({
            success: true,
            data: subscribe
        });
    } catch (error) {
        console.error("Error fetching subscribe:", error);
        next(new ErrorResponse("Server error while fetching subscribe", 500));
    }
};

// @desc    Update subscribed email (Admin only)
// @route   PUT /api/admin/subscribe/:id
// @access  Private (Admin)
export const updateSubscribe = async (req, res, next) => {
    try {
        const { email, firstName, lastName } = req.body;

        if (!firstName || !firstName.toString().trim()) {
            return res.status(400).json({
                success: false,
                message: "First name is required"
            });
        }

        if (!lastName || !lastName.toString().trim()) {
            return res.status(400).json({
                success: false,
                message: "Last name is required"
            });
        }

        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email"
            });
        }

        // Check if email already exists (excluding current record)
        const existingSubscribe = await Subscribe.findOne({ 
            email, 
            _id: { $ne: req.params.id } 
        });

        if (existingSubscribe) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const subscribe = await Subscribe.findByIdAndUpdate(
            req.params.id,
            {
                email: email.trim(),
                firstName: firstName.toString().trim(),
                lastName: lastName.toString().trim(),
            },
            { new: true, runValidators: true }
        );

        if (!subscribe) {
            return next(new ErrorResponse("Subscribe not found", 404));
        }

        res.status(200).json({
            success: true,
            data: subscribe
        });
    } catch (error) {
        console.error("Error updating subscribe:", error);
        next(new ErrorResponse("Server error while updating subscribe", 500));
    }
};

// @desc    Delete subscribed email (Admin only)
// @route   DELETE /api/admin/subscribe/:id
// @access  Private (Admin)
export const deleteSubscribe = async (req, res, next) => {
    try {
        const subscribe = await Subscribe.findByIdAndDelete(req.params.id);

        if (!subscribe) {
            return next(new ErrorResponse("Subscribe not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "Subscribe deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting subscribe:", error);
        next(new ErrorResponse("Server error while deleting subscribe", 500));
    }
};

// @desc    Delete multiple subscribed emails (Admin only)
// @route   DELETE /api/admin/subscribe/bulk
// @access  Private (Admin)
export const deleteMultipleSubscribes = async (req, res, next) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide an array of IDs to delete"
            });
        }

        const result = await Subscribe.deleteMany({ _id: { $in: ids } });

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} subscribes deleted successfully`
        });
    } catch (error) {
        console.error("Error deleting multiple subscribes:", error);
        next(new ErrorResponse("Server error while deleting subscribes", 500));
    }
};