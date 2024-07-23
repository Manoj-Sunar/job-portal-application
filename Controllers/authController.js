import UserModel from "../Model/UserModel.js";


//user registration
export const userRegister=async(req,res,next)=>{
    try {
       
        const {name,email,password,location}=req.body;
        if(name&&email&&password){
         const isUserExist=await UserModel.findOne({email:email});
       
   
         if(!isUserExist){
            const newUsers=await UserModel.create({
                name:name,
                email:email,
                password:password,
                location:location,
            });



            res.status(201).json({status:true,msg:"user register successfully",token:await newUsers.generateToken()});
         }else{
            return res.status(404).json({status:404,msg:"user is already exist"});
         }

        }else{
            res.status(404).json({status:404,msg:"all fields are required"})
        }
        
    } catch (error) {
        next(error);
    }
}


//user login

export const userLogin=async(req,res,next)=>{
    try {
        
      
        const{email,password}=req.body;
        const isUserExist=await UserModel.findOne({email:email}).select("+password");
       
        if(email&&password){
            const isMatchPass=await isUserExist.comparePassword(password)
                if(isUserExist){
                  if(isMatchPass){
                    isUserExist.password=undefined;
                    res.status(201).json({status:true,msg:"user login successfully",isUserExist,token:await isUserExist.generateToken()});
                  }else{
                    res.status(404).json({status:false,msg:"invalid credentials"});
                  }

                }else{
                    res.status(404).json({status:false,msg:"invalid credentials"});
                }
        }else{
            res.status(404).json({status:false,msg:"All fields are required"});
        }
        
    } catch (error) {
        next(error);
    }
}