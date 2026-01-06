import Volunteer from "../models/Volunteer.js";
import ErrorResponse from "../utils/errorResponse.js";

// Create a new volunteer
export const createVolunteer = async (req, res) => {
    try {
        if (req.body.volunteerField !== "Social Media Management") {
            req.body.socialMedia = undefined; // Remove socialMedia if not needed
        }

        const volunteerExist = await Volunteer.findOne({email:req.body.email});

        if(volunteerExist){
            return res.status(400).json({ success: false, errors: "Volunteer already exist" });
        }
        const volunteer = new Volunteer(req.body);
        await volunteer.save();
        res.status(201).json({ success: true, data: volunteer });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get all volunteers (Public route)
export const getAllVolunteers = async (req, res) => {
    try {
        const volunteers = await Volunteer.find();
        res.status(200).json({ success: true, data: volunteers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get a single volunteer (Public route)
export const getVolunteer = async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);
        if (!volunteer) {
            return res.status(404).json({ success: false, error: "Volunteer not found" });
        }
        res.status(200).json({ success: true, data: volunteer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ==================== ADMIN VOLUNTEERS MANAGEMENT ====================

// @desc    Get all volunteers (Admin only) with pagination
// @route   GET /api/admin/volunteers
// @access  Private (Admin)
export const getAllVolunteersAdmin = async (req, res, next) => {
    try {
        console.log("Fetching volunteers - Query params:", req.query);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const volunteerField = req.query.volunteerField;

        // Build query
        let query = {};
        if (volunteerField) {
            query.volunteerField = volunteerField;
        }

        console.log("Volunteer query:", query);
        const volunteers = await Volunteer.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Volunteer.countDocuments(query);

        console.log(`Found ${volunteers.length} volunteers out of ${total} total`);

        res.status(200).json({
            success: true,
            data: volunteers,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        console.error("Error fetching volunteers:", error);
        console.error("Error stack:", error.stack);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error while fetching volunteers",
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// @desc    Get single volunteer by ID (Admin only)
// @route   GET /api/admin/volunteers/:id
// @access  Private (Admin)
export const getVolunteerById = async (req, res, next) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);

        if (!volunteer) {
            return next(new ErrorResponse("Volunteer not found", 404));
        }

        res.status(200).json({
            success: true,
            data: volunteer
        });
    } catch (error) {
        console.error("Error fetching volunteer:", error);
        next(new ErrorResponse("Server error while fetching volunteer", 500));
    }
};

// @desc    Delete volunteer (Admin only)
// @route   DELETE /api/admin/volunteers/:id
// @access  Private (Admin)
export const deleteVolunteer = async (req, res, next) => {
    try {
        const volunteer = await Volunteer.findByIdAndDelete(req.params.id);

        if (!volunteer) {
            return next(new ErrorResponse("Volunteer not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "Volunteer deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting volunteer:", error);
        next(new ErrorResponse("Server error while deleting volunteer", 500));
    }
};

// @desc    Delete multiple volunteers (Admin only)
// @route   DELETE /api/admin/volunteers/bulk
// @access  Private (Admin)
export const deleteMultipleVolunteers = async (req, res, next) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide an array of IDs to delete"
            });
        }

        const result = await Volunteer.deleteMany({ _id: { $in: ids } });

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} volunteers deleted successfully`
        });
    } catch (error) {
        console.error("Error deleting multiple volunteers:", error);
        next(new ErrorResponse("Server error while deleting volunteers", 500));
    }
};

// @desc    Get volunteer statistics (Admin only)
// @route   GET /api/admin/volunteers/stats
// @access  Private (Admin)
export const getVolunteerStats = async (req, res, next) => {
    try {
        console.log("Fetching volunteer stats");
        const total = await Volunteer.countDocuments({});

        // Get volunteer field breakdown
        const volunteerFieldStats = await Volunteer.aggregate([
            { $group: { _id: '$volunteerField', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Get daily commitment breakdown
        const dailyCommitmentStats = await Volunteer.aggregate([
            { $group: { _id: '$dailyCommitment', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const statsData = {
            total,
            byVolunteerField: volunteerFieldStats,
            byDailyCommitment: dailyCommitmentStats
        };

        console.log("Volunteer stats:", statsData);

        res.status(200).json({
            success: true,
            data: statsData
        });
    } catch (error) {
        console.error("Error fetching volunteer stats:", error);
        console.error("Error stack:", error.stack);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error while fetching volunteer stats",
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};