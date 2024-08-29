import mongoose from 'mongoose';
import User from './userModel.js';

const { Schema } = mongoose;

const reHomeSchema = new Schema({
    petName: { type: String, required: true },
    petType: { type: String, required: true },
    petBreed: { type: String, required: true },
    age: { type: String, required: true, enum: ['puppyhood', 'Adolescence', 'Adulthood', 'Senior'] },
    gender: { type: String, required: true, enum: ['male', 'female'] },
    ownersName: { type: String, required: true },
    ownersPhone: { type: Number, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    petVaccinated: { type: String, required: true, enum: ['Yes', 'No'] },
    petNeutered: { type: String, required: true, enum: ['Yes', 'No'] },
    petSpayed: { type: String, required: true, enum: ['Yes', 'No'] },
    petShots: { type: String, required: true, enum: ['Yes', 'No'] },
    petIsGoodWithDogs: { type: String, required: true, enum: ['Yes', 'No'] },
    petIsGoodWithCats: { type: String, required: true, enum: ['Yes', 'No'] },
    petIsGoodWithKids: { type: String, required: true, enum: ['Yes', 'No'] },
    reasonForDonation: { type: String, maxLength: 300 },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image:{
        secure_url:{
        type:String,
        required:true
      },
      public_id:{
        type:String,
        required:true
      }
    },
    postedBy: {
        type: String,
        required: true,
    },
    postedOn: {
        type: Date,
        default: Date.now,
        required: true,
    }
});

// Middleware to populate postedBy from User's fullName
reHomeSchema.pre('save', async function (next) {
    try {
        const user = await User.findById(this.ownerId);
        if (user) {
            this.postedBy = user.fullName;
        } else {
            throw new Error('User not found');
        }
        next();
    } catch (error) {
        next(error);
    }
});

const Donate = mongoose.model('Donate', reHomeSchema);

export default Donate;
