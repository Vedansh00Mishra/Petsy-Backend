import express from "express";
import { deleteDonation, donate, getAllDonations, getDonateDetails, getMyDonations } from "../Controllers/donateController.js";
import  requireAuth  from "../middlewares/protectRoute.js";
import Donate from "../models/reHome.js";
import { upload } from "../middlewares/multerMiddleware.js";

const router = express.Router();

// Route for handling donation submissions
router.post("/donate/post", upload.single("image"),requireAuth, donate);
router.get("/donations",requireAuth,getAllDonations)
router.get("/donations/me",requireAuth,getMyDonations)
router.get('/donate/:id', requireAuth, getDonateDetails)

  
router.delete('/donations/delete/:id',requireAuth,deleteDonation);
export default router;
