import express from 'express';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express'
import fileupload from 'express-fileupload';
import path from 'path';
import cors from 'cors';

import { connectDB } from './lib/db.js';

import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import adminRoute from './routes/admin.route.js';
import songRoute from './routes/song.route.js';
import albumRoute from './routes/album.route.js';
import statRoute from './routes/stat.route.js';

dotenv.config();

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}))

app.use(express.json()); // to parse req.body
app.use(clerkMiddleware()); // this is will add auth to req obj => req.auth
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits:{
        fileSize: 10 * 1024 * 1024 // 10mb max size
    }
}));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/songs", songRoute);
app.use("/api/albums", albumRoute);
app.use("/api/stats", statRoute);

// error handler
app.use((err, req, res, next)=> {
    res.status(500).json({message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message })
})

app.listen(PORT, () => {
    console.log(`Servre is running on port http://localhost:${PORT}`);
    connectDB();
})

// todo: socket.io implementation
