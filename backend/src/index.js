import express from 'express';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express'
import fileupload from 'express-fileupload';
import path from 'path';
import cors from 'cors';
import { createServer } from 'http';
import fs from 'fs';
import cron from 'node-cron';

import { initializeSocket } from './lib/socket.js';
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

const httpServer = createServer(app);
initializeSocket(httpServer)

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

// cron jobs
const tmpDir = path.join(process.cwd(), "tmp");

cron.schedule("0 * * * *", () => {
    if(fs.existsSync(tmpDir)) {
        fs.readDir(tmpDir, (err, files) => {
            if(err){
                console.log("error", err);
                return;
            }
            for(const file of files){
                fs.unlink(path.join(tmpDir, file), (err) => {});
            }
        })
    }
})

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/songs", songRoute);
app.use("/api/albums", albumRoute);
app.use("/api/stats", statRoute);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
    })
}

// error handler
app.use((err, req, res, next)=> {
    res.status(500).json({message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message })
})

httpServer.listen(PORT, () => {
    console.log(`Servre is running on port http://localhost:${PORT}`);
    connectDB();
})
