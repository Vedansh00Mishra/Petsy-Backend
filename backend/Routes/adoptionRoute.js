import express from 'express';
import { createAdoption, getAllAdoptionsForUser, getAllAdoptionsForPet, deleteAdoption } from '../Controllers/adoptionController.js'; // Adjust the path as necessary

const router = express.Router();

// Route to create a new adoption record
router.post('/create', createAdoption);

// Route to get all adoption applications for a specific user
router.get('/adoptions/user/:userId', getAllAdoptionsForUser);

// Route to get all adoption applications for a specific pet
router.get('/adoptions/pet/:petId', getAllAdoptionsForPet);

// Route to delete an adoption record by ID
router.delete('/adoptions/:id', deleteAdoption);

export default router;
