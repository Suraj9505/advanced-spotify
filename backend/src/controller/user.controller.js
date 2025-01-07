import { Message } from "../models/message.model.js";
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
};

export const getMessages = async(req, res, next) => {
    try {
        const myId = req.auth.userId;
        const { userId } = req.params;

        const messages = await Message.find({$or: [{senderId: myId, receiverId: userId}, {senderId: userId, receiverId: myId}]}).sort({createdAt: 1});

        res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
}


// favourite songs controller

export const getFavorites = async (req, res, next) => {
    try {
        const user = req.auth.userId;
        if(!user) return res.status(404).json({message: "No user found"});

        const response = await User.findOne({clerkId: user}).populate("favorites");

        res.status(200).json(response.favorites);
    } catch (error) {
        next(error);
    }
};

export const addFavorite = async (req, res, next) => {
    try {
        const user = req.auth.userId;
        console.log(user);
        const { songId } = req.params;
        await User.findOneAndUpdate({clerkId: user}, {$addToSet: {favorites: songId}}, {new: true});

        res.status(200).json({message: "Song added to favorites", favorites: user.favorites});

    } catch (error) {
        next(error);
    }
};

export const removeFavorite = async (req, res, next) => {
    try {
        const user = req.auth.userId;
        const { songId } = req.params;
        await User.findOneAndUpdate({clerkId: user}, {$pull: {favorites: songId}});
        res.status(200).json({message: "Song removed from favorites"});

    } catch (error) {
        next(error);
    }
};

export const removeAllFavorites = async (req, res, next) => {
    try {
        const user = req.auth.userId;
        await User.findByIdAndUpdate(user, {$set: {favorites: []}});
    } catch (error) {
        next(error);
    }
}
