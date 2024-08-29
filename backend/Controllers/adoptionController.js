import Adoption from '../models/adoptionModel.js'; // Adjust the path as necessary
import Donate from '../models/reHome.js'; // Adjust the path as necessary

// Create a new adoption record
export const createAdoption = async (req, res) => {
    try {
        const { fullName, email, phone, address, petId, userId } = req.body;

        // Validate if the pet exists in the Donate collection
         if(!fullName, !email, !phone, !address, !petId, !userId){
            return res.status(400).json({ message: 'Fill all detials' });
        }
        const pet = await Donate.findById(petId);
        if (!pet) {
            return res.status(400).json({ message: 'Pet not found' });
        }
       

        const newAdoption = new Adoption({  fullName, email, phone, address, petId, userId });
        await newAdoption.save();

        res.status(201).json(newAdoption);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllAdoptionsForUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Fetch all adoption applications for the specified user
        const adoptions = await Adoption.find({ userId }).populate('petId');

        if (adoptions.length === 0) {
            return res.status(404).json({ message: 'No adoption applications found for this user' });
        }

        res.status(200).json(adoptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllAdoptionsForPet = async (req, res) => {
    try {
        const petId = req.params.petId;

        // Fetch all adoption applications for the specified pet
        const adoptions = await Adoption.find({ petId }).populate('petId');

        if (adoptions.length === 0) {
            return res.status(404).json({ message: 'No adoption applications found for this pet' });
        }

        res.status(200).json(adoptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an adoption record by ID
export const deleteAdoption = async (req, res) => {
    try {
        const deletedAdoption = await Adoption.findByIdAndDelete(req.params.id);
        if (!deletedAdoption) {
            return res.status(404).json({ message: 'Adoption not found' });
        }
        res.status(200).json({ message: 'Adoption deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
