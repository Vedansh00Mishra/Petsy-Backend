import User from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from "../jwt/generateToken.js";
import ErrorHandler from "../middlewares/error.js";


export const SignUp = async (req, res) => {
    try {
        const { fullName, username, email, phone, password, confirmPassword } = req.body;

        if (!fullName || !username || !email || !phone || !password || !confirmPassword) {
            return res.status(400).json({ message: "Please fill all the details" });
        }
        
        if (password != confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            username,
            email,
            phone,
            password: hashedPassword,
        });

        await newUser.save();

        // Generate JWT token here and set it in a cookie
        generateTokenAndSetCookie(newUser, 200, res, "User registered Successfully!");

    } catch (err) {
        console.error("Error in signup controller", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const Login = async (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password ) {
        return next(new ErrorHandler("Please provide email, password", 400));
    }

    try {
        // Find user by email
        const user = await User.findOne({ email }).select("+password");

        // Check if user exists
        if (!user) {
            return next(new ErrorHandler("Invalid email or password", 400));
        }

        // Compare passwords
        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            return next(new ErrorHandler("Invalid email or password", 400));
        }

             
        // Send token if everything is fine
        generateTokenAndSetCookie(user, 200, res, "User logged in successfully");
    } catch (error) {
        // Handle any other errors
        return next(new ErrorHandler(error.message, 500));
    }
};

export const Logout = async(req,res) =>{
    try {
        res.status(201).cookie("token", "", {
            httpOnly: true,
            expiresIn: new Date(Date.now()),
          }).json({
            success: true,
            message: "User Logged Out successfully!",
          });
    } catch (error) {
        console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
    }
}
export const getUser = async (req, res, next) => {
    try {
        console.log('req.user:', req.user); // Debug: Check if req.user is populated
    
        if (!req.user || !req.user.id) {
          throw new Error('User ID not found in request');
        }
    
        const user = await User.findById(req.user.id); // Fetch user based on ID
    
        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
    
        res.status(200).json({ success: true, user });
      } catch (error) {
        console.error('Error in getUser controller:', error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
    };