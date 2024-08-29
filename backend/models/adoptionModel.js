import mongoose from "mongoose";
import Donate from "../models/reHome.js"; // Ensure the path to your Donate model is correct

const adoptionSchema = new mongoose.Schema({
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donate",
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
  });


const Adoption = mongoose.model('Adoption', adoptionSchema);
export default Adoption;
