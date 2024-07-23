import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
    },

    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: [true, "User is already exist"],
      validate: validator.isEmail,
    },

    password: {
      type: String,
      required: [true, "password is Required"],
      select:true,
      minlength: [8, "password length should be atleast 8 characters"],
    },

    location: {
      type: String,
      default: "Pokhara, Nepal",
    },
  },
  { timestamps: true }
);


//generate token
Schema.methods.generateToken=async function(){
    try {
        return jwt.sign({
          userId:this._id.toString(),
          email:this.email,
          
        },process.env.SIGNATURE,
        {expiresIn:"1d"});
        
    } catch (error) {
        console.log(error)
    }
}


//user password bcrypt middleware
Schema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const saltRound = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(this.password, saltRound);
    this.password = hashPassword;
  } catch (error) {
    next(error);
  }
});

//user login middleware
Schema.methods.comparePassword=async function(password){
    return bcrypt.compare(password,this.password);
}


export default mongoose.model("user", Schema);
