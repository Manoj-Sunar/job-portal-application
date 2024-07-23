import mongoose from "mongoose";

const JobsSchema=new mongoose.Schema({
   Company:{
    type:String,
    required:[true,"Company name is required"],
   },

   position:{
    type:String,
    required:[true,"Job position is required"],
    maxlength:100,
   },

   status:{
    type:String,
    enum:['Pending','Reject','interview'],
    default:"Pending",
   },

   workType:{
    type:String,
    enum:['full-time','part-time','internship','contaract'],
    default:'full-time',
   },

   workLocation:{
    type:String,
    default:"Pokhar, New Road",
    required:[true,"Work location is required"],
   },

   createdBy:{
      type:mongoose.Types.ObjectId,
      ref:"user",
   }

},{timestamps:true});

export default mongoose.model("Job",JobsSchema);