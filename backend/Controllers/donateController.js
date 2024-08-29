import Donate from "../models/reHome.js";
import requireAuth from "../middlewares/protectRoute.js"; // Adjust path as per your project structure
import cloudinary from "cloudinary";
import ErrorHandler from "../middlewares/error.js";
import {uploadImageOnCloudinary} from "../helper/cloudinaryHelper.js"
// Controller function to handle donation creation with image upload
export const donate = async (req, res, next) => {
    try {
        
 // Check if all required fields are present
        console.log(req.body); 
        const { petName, petType, petBreed, age, gender, ownersName, ownersPhone, state, city, petVaccinated, petNeutered, petSpayed, petShots, petIsGoodWithDogs, petIsGoodWithCats, petIsGoodWithKids, reasonForDonation, postedBy} = req.body;
        const image = req.file?.fieldname;
        const imagePath = req.file?.path;
        if (!petName || !petType || !petBreed || !age || !gender || !ownersName || !ownersPhone || !state || !city || !petVaccinated || !petNeutered || !petSpayed || !petShots || !petIsGoodWithDogs || !petIsGoodWithCats || !petIsGoodWithKids || !reasonForDonation || !postedBy) {
            throw new ErrorHandler("Please fill all fields.", 400);
        }

        const {secure_url, public_id} =  await uploadImageOnCloudinary(imagePath,"petsImage")

        if(!secure_url){
          return res.status(400).send({
            success:false,
            message:"Errpr while uploading image",
            error:secure_url
          })
        }

        // Create a new instance of Donate model
        const newPet = new Donate({
            petName,
            petType,
            petBreed,
            age,
            gender,
            ownersName,
            ownersPhone,
            state,
            city,
            petVaccinated,
            petNeutered,
            petSpayed,
            petShots,
            petIsGoodWithDogs,
            petIsGoodWithCats,
            petIsGoodWithKids,
            reasonForDonation,
            ownerId: req.user._id, // Assuming ownerId is a field in Donate model to store the ID of the donating user
            image:{
              secure_url,
              public_id
            },
            postedBy
        });

        // Save the new instance to the database
        await newPet.save();

        // Respond with the saved pet data
        res.status(201).json({
            success: true,
            message: "Pet donated successfully!",
            pet: newPet
        });
    } catch (err) {
        console.error("Error in donate controller", err.message);
        res.status(err.statusCode || 500).json({ error: err.message });
    }
};

export const getAllDonations = async (req, res, next) => {
    try {
        

        // Fetch all donations from the database
        const donations = await Donate.find({});

        // Respond with the list of donations
        res.status(200).json({
            success: true,
            donations,
        });
    } catch (err) {
        console.error("Error in getAllDonations controller", err.message);
        res.status(err.statusCode || 500).json({ error: err.message });
    }
};

// Controller function to delete a donation by ID
export const deleteDonation = async (req, res, next) => {
    try {


        // Find the donation by ID and delete it
        const donation = await Donate.findByIdAndDelete(req.params.id);

        // Check if donation was found and deleted
        if (!donation) {
            throw new ErrorHandler("Donation not found!", 404);
        }

        // Respond with a success message
        res.status(200).json({
            success: true,
            message: "Donation deleted successfully!",
        });
    } catch (err) {
        console.error("Error in deleteDonation controller", err.message);
        res.status(err.statusCode || 500).json({ error: err.message });
    }
};
export const getMyDonations = async (req, res, next) => {
    try {
      // Fetch all donations where ownerId matches the logged-in user's ID
      const donations = await Donate.find({ ownerId: req.user._id });
  
      // Respond with the list of donations
      res.status(200).json({
        success: true,
        donations,
      });
    } catch (err) {
      console.error("Error in getMyDonations controller", err.message);
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  };

  export const getDonateDetails =async (req, res, next) => {
    const { id } = req.params;
    try {
      const donation = await Donate.findById(id);
      if (!donation) {
        return next(new ErrorHandler("donation not found.", 404));
      }
      res.status(200).json({
        success: true,
        donation,
      });
    } catch (error) {
      return next(new ErrorHandler(`Invalid ID / CastError`, 404));
    }
  };