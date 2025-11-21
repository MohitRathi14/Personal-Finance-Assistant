import user from "../models/user";

// get all users controller
export const getAllUsersController = async (req, res) => {
    try {
        const users = await user.find({});
        res.status(200).send({
            success: true,
            message: "All users fetched successfully",
            data: users
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error fetching users"
        });
    }   
};

// get single user controller
export const getSingleUserController = async (req, res) => {
    try {
        const userId = req.params.id;
        const singleUser = await user.findById(userId);
        if (!singleUser) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).send({
            success: true,
            message: "User fetched successfully",
            data: singleUser
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error fetching user"
        });
    }
};

// update user controller
export const updateUserController = async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedData = req.body;
        const updatedUser = await user.findByIdAndUpdate(userId, updatedData, { new: true });
        if (!updatedUser) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).send({
            success: true,
            message: "User updated successfully",
            data: updatedUser
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error updating user"
        });
    }
};

// delete user controller
export const deleteUserController = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await user.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).send({
            success: true,
            message: "User deleted successfully",
            data: deletedUser
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error deleting user"
        });
    }
};

// get user profile controller
export const getUserProfileController = async (req, res) => {
    try {
        const userId = req.user.id;
        const userProfile = await user.findById(userId);
        if (!userProfile) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).send({
            success: true,
            message: "User profile fetched successfully",
            data: userProfile
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error fetching user profile"
        });
    }   
};

// update user profile controller
export const updateUserProfileController = async (req, res) => {
    try {
        const userId = req.user.id;
        const updatedData = req.body;
        const updatedUserProfile = await user.findByIdAndUpdate(userId, updatedData, { new: true });
        if (!updatedUserProfile) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).send({
            success: true,
            message: "User profile updated successfully",
            data: updatedUserProfile
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error updating user profile"
        });
    }
};

// delete user profile controller
export const deleteUserProfileController = async (req, res) => {
    try {
        const userId = req.user.id;
        const deletedUserProfile = await user.findByIdAndDelete(userId);
        if (!deletedUserProfile) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).send({
            success: true,
            message: "User profile deleted successfully",
            data: deletedUserProfile
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error deleting user profile"
        });
    }
};