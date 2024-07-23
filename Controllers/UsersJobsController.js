import mongoose from "mongoose";
import JobsModel from "../Model/JobsModel.js";
import moment from "moment";

export const JobsCreated=async(req,res,next)=>{
    try {
        const{Company,position,status,workType,workLocation}=req.body;
        if(Company&&position){
               req.body.createdBy=req.userData._id;
               console.log(req.body.createdBy);
               const jobs=await JobsModel.create(req.body);

               res.status(201).json({status:true,msg:"Jobs request successfully",jobs})
        }else{
            res.status(404).json({status:false,msg:"All fields are required"});
        }
        
    } catch (error) {
        next(error);
    }
}


//Getting jobs Controller

export const GetsJobs=async(req,res,next)=>{
    try {

        const {status,workType,search,sort}=req.query;
        //condition for searching filters
        const queryObject={
            createdBy:req.userId,
        }
      
        if(status&&status!="all"){
            queryObject.status=status;
           
        }

        if(workType&&workType!="all"){
            queryObject.workType=workType;
        }

        if(search){
            queryObject.position={$regex:search,$options:"i"};
        }

       

        let queryResult= JobsModel.find(queryObject);


         //sorting 
         if(sort==="latest"){
            queryResult=queryResult.sort("-createdAt");

         }

         if(sort==="oldest"){
            queryResult=queryResult.sort("createdAt");
         }

         if(sort==="a-z"){
            queryResult=queryResult.sort("position");
         }

         if(sort==="z-a"){
            queryResult=queryResult.sort("-position");
         }

         //pagination
         const page=Number(req.query.page)||1;
         const limit=Number(req.query.limit)||10;
         const skip=(page-1) * limit;
         queryResult=queryResult.skip(skip).limit(limit);

         const totalJobs=await JobsModel.countDocuments(queryResult);
         const noOfPage=Math.ceil(totalJobs/limit);


         const jobs=await queryResult;
        res.status(200).json({status:true,totalJobs,jobs,noOfPage})
    
        
    } catch (error) {
        next(error);
    }
}


// user jobs updates api
export const JobsUpdate=async(req,res,next)=>{
    try {

       
          const {id}=req.params;
          const jobUpdate=await JobsModel.findOne({_id:id});
          if(jobUpdate){
          
         
             if(req.userId===jobUpdate.createdBy.toString()){
                const updatedData=req.body;
                const update=await JobsModel.updateOne({_id:id},{
                    $set:updatedData,
                });

                res.status(200).json({status:true,msg:"job updated successfully",update});

             }else{
                res.status(404).json({status:false,msg:"sorry, you are not Authorized to update this job"});
             }
          }else{
            res.status(404).json({status:false,msg:"Job does'nt exist"});
          }
        

    } catch (error) {
     next(error);
    }
}


//export const Jobs Delete api
export const JobsDelete=async(req,res,next)=>{
    try {
       const{id}=req.params;
       const job=await JobsModel.findOne({_id:id});
       if(job){
          if(req.userId===job.createdBy.toString()){
              const deleteJob=await JobsModel.deleteOne({_id:id});
              res.status(200).json({status:true,msg:"job deleted successfully",deleteJob});
          }else{
            res.status(404).json({status:false,msg:"Sorry, you are not authorized to delete this job"});
          }
       }else{
        res.status(404).json({status:false,msg:"Sorry, job does'nt exist"});
       }
    } catch (error) {
        next(error);
    }
}




//jobs stats filter
export const jobsStats_filter=async(req,res,next)=>{
    try {
        const stats=await JobsModel.aggregate([
            {
                $match:{
                    createdBy:new mongoose.Types.ObjectId(req.userId),
                },         

            },

            {
                $group:{
                    _id:"$status",
                    count:{$sum:1}
                }

            },

        ]);

        const MonthlyAndYearly=await JobsModel.aggregate([
            {
                $match:{
                    createdBy:new mongoose.Types.ObjectId(req.userId),
                }
            },

            {
                $group:{
                    _id:{
                        year:{$year:"$createdAt"},
                        month:{$month:"$createdAt"},
                    },

                    count:{
                        $sum:1,
                    },
                },
            },
        ]);

       

        MonthlyAndYearly.map((item)=>{
            const{_id:{year,month},count}=item;
            const date=moment().month(month-1).year(year).format("MMM Y");
            return {date,count};
        }).reverse();
    
        res.status(200).json({stats,totalJobs:stats.length,MonthlyAndYearly});
        
    } catch (error) {
        next(error);
    }
}