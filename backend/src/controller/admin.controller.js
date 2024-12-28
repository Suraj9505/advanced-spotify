import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js"
import cloudinary from "../lib/cloudinary.js";
import { getAllAlbums } from "./album.controller.js";

// helper function for cloudinary uploads
const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: "auto",
        })
        return result;
    } catch (error) {
        console.log("Error in uploadToCloudinary function: ", error);
        throw new Error("Error uploading files");
    }
}

export const createSong = async (req, res, next) => {
    try {
        if (!req.files || !req.files.audioFile ) {
            return res.status(400).json({ message: "Please upload audio files" });
        }

        const { title, artist, albumId, duration } = req.body;
        const audioFile = req.files.audioFile;
        const imageFile = req.files.imageFile;

        let imageUrl;
        let imageCloudinaryId = null;

        // image uploading and fallback
        if(imageFile){
            const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

            if (!allowedImageTypes.includes(imageFile.mimetype)) {
                return res.status(400).json({ message: "Invalid cover file type. Only image files are allowed." });
            }

            const imageUpload = await uploadToCloudinary(imageFile);
             imageUrl = imageUpload.secure_url;
             imageCloudinaryId = imageUpload.public_id;
        }
        else {
            imageUrl = "/music_placeholder.png"
        }
        const allowedAudioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg'];



        // audio uploading
        if (!allowedAudioTypes.includes(audioFile.mimetype)) {
            return res.status(400).json({ message: "Invalid audio file type. Only audio files are allowed." });
        }
        const audioUpload = await uploadToCloudinary(audioFile);

        const audioUrl = audioUpload.secure_url;

        const song = new Song({
            title,
            artist,
            audioUrl,
            imageUrl,
            duration,
            albumId: albumId || null,
            audioCloudinaryId: audioUpload.public_id, // Store the public_id for the audio
            imageCloudinaryId: imageCloudinaryId, // Store the public_id for the image
        });

        await song.save();

        // If song belongs to an album, update the album's song array
        if (albumId) {
            await Album.findByIdAndUpdate(albumId, {
                $push: { songs: song._id },
            });
        }

        res.status(200).json(song);
    } catch (error) {
        console.error("Error in createSong function: ", error);
        next(error);
    }
};



export const deleteSong = async (req, res, next) => {
    try {
        const { id } = req.params;
        const song = await Song.findById(id);

        // If the song is not found, return an error
        if (!song) {
            return res.status(404).json({ message: "Song not found" });
        }

        // If song belongs to an album, update the album's song array
        if (song.albumId) {
            await Album.findByIdAndUpdate(song.albumId, {
                $pull: { songs: song._id },
            });
        }

        // Only delete from Cloudinary if IDs are not null
        if (song.imageCloudinaryId) {
            await cloudinary.uploader.destroy(song.imageCloudinaryId, { resource_type: "image" });
        }

        if (song.audioCloudinaryId) {
            await cloudinary.uploader.destroy(song.audioCloudinaryId, { resource_type: "video" });
        }

        // Delete the song from the database
        await Song.findByIdAndDelete(id);

        res.status(200).json({ message: "Song deleted successfully" });
    } catch (error) {
        console.log("Error in deleteSong: ", error);
        next(error);
    }
};



export const createAlbum = async (req, res, next) => {
    try {
        const { title, artist, releaseYear } = req.body;
        const { imageFile } = req.files || {};

        let imageUrl;
        let imageCloudinaryId = null;

        // Validate image file
        if (imageFile) {
            // Validate image file type
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedImageTypes.includes(imageFile.mimetype)) {
            return res.status(400).json({ message: "Invalid image file type. Only JPEG, PNG, JPG, and WEBP are allowed." });
        }

        // Upload the image to Cloudinary
        const imageUpload = await uploadToCloudinary(imageFile);
        imageUrl = imageUpload.secure_url; // Get the secure URL of the uploaded image
        imageCloudinaryId = imageUpload.public_id;
        }
        else{
            imageUrl = "/album_placeholder.png"
        }

        // Create a new album and store the public_id for deletion later
        const album = new Album({
            title,
            artist,
            imageUrl,
            releaseYear,
            imageCloudinaryId: imageCloudinaryId, // Store the public_id for the image
        });

        await album.save(); // Save the album to the database

        res.status(201).json(album); // Send the created album as the response
    } catch (error) {
        console.log("Error in createAlbum:", error); // Log any errors for debugging
        next(error); // Pass the error to the next middleware (error handler)
    }
};

export const deleteAlbum = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Song.deleteMany({ albumId: id });
        const album = await Album.findByIdAndDelete(id);

        if (album.imageCloudinaryId !== null) {
            await cloudinary.uploader.destroy(album.imageCloudinaryId, { resource_type: "image" });
        }
        res.status(200).json({ message: "Album deleted successfully" })
    } catch (error) {
        console.log("Error in deleteAlbum", error);
        next(error);
    }
}

export const checkAdmin = async (req, res, next) => {
    res.status(200).json({ admin: true })
}
