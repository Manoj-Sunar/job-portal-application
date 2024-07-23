
const ErrorMiddleware=(err,req,res,next)=>{
   res.status(500).send({
    status:false,
    message:"something went wrong",
    err,
   });

   
};

export default ErrorMiddleware;