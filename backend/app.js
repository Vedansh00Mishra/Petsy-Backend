import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import userRoutes from './Routes/userRoutes.js';
import adoptionRoutes from "./Routes/adoptionRoute.js"
import petRoutes from './Routes/donateRoute.js'
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import fileUpload from "express-fileupload";
import multer from "multer";
import cors from "cors";
import { Router } from "express";

const app = express();
const router = express.Router();

dotenv.config();
// const __dirname = path.resolve();

const PORT = process.env.PORT || 5000;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
  });
  
// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // if you need to include cookies in the requests
}));
app.use(express.json()); // Body parser middleware
app.use(cookieParser());
// Routes
app.use("/api/users", userRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/adoptions", adoptionRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGO_DB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error.message);
    });


//image upload
