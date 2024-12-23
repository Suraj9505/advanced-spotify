import { User } from "../models/user.model.js";

export const getAllUsers = async (req, res, next) => {
    try {
        const currentUser = req.auth.userId;
        const users = await User.find({clerkId: {$ne: currentUser}});
        if(!users) return res.status(404).json({message: "No users found"});

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}
