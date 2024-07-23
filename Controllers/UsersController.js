import UserModel from "../Model/UserModel.js";


//user update api
export const UserDataUpdates=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const updatedData=req.body;
        const updateSave=await UserModel.updateOne({_id:id},{
            $set:updatedData,
        });

        res.status(201).json({status:true,msg:"user update successfully"});
 
    
    } catch (error) {
        next(error);
    }
}

