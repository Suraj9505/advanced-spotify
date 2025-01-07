import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { addFavorite, getAllUsers, getFavorites, getMessages, removeFavorite } from "../controller/user.controller.js";

const router = Router();

router.get("/", protectRoute, getAllUsers);

router.get("/messages/:userId", protectRoute, getMessages);


// favourite song routes
router.get("/favorites", protectRoute, getFavorites);

router.post("/favorite/:songId", protectRoute, addFavorite);
router.delete("/favorite/:songId", protectRoute, removeFavorite);
// router.delete("/favorite", protectRoute, removeAllFavorites);
export default router;
