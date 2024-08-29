import  catchAsyncErrors  from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import  jwt  from "jsonwebtoken";
import User from "../models/userModel.js";

 const requireAuth = catchAsyncErrors(async(req,res,next)=>{
    try {
        const token = req.cookies.token; // Assuming token is stored in cookies
    
        if (!token) {
          throw new Error('User not authenticated');
        }
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT token
        req.user = await User.findById(decoded.id); // Fetch user based on decoded token ID
    
        if (!req.user) {
          throw new Error('User not found'); // Handle case where user does not exist
        }
    
        next(); // Move to the next middleware or route handler
      } catch (error) {
        console.error('Authentication error:', error.message);
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
    });

export default requireAuth;