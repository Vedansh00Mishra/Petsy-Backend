import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcryptjs from 'bcryptjs'
const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },phone:{
        type:Number,
        required:true,
        unique:true
    },password:{
        type:String,
        required:true
    },

})

userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcryptjs.compare(enteredPassword,this.password);
};
const User = new mongoose.model("User",userSchema);

export default User;