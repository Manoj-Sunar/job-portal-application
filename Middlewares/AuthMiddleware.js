import jwt from "jsonwebtoken";
import UserModel from "../Model/UserModel.js";

export const userAuthentication=async(req,res,next)=>{
        try {
            const token=req.header("Authorization");
              
            
            if(!token){
                res.status(404).json({status:false,msg:"Unauthorized http request"});
            }

            const jwtToken=token.replace("Bearer","").trim();

            const verifytoken=jwt.verify(jwtToken,process.env.SIGNATURE);
            const userData=await UserModel.findOne({_id:verifytoken.userId}).select({password:0});
            
            req.userData=userData;
            req.token=token;
            req.userId=userData._id.toString();

            next();
                       
        } catch (error) {
            res.status(404).json({status:false,msg:"Unauthorized user"});
        }
}