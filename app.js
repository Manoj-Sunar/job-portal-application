//import statements
import  express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ConnectDb from "./config/Db.js";
import router  from "./Routes/AuthRoute1.js";
import UserRouter from "./Routes/UserRoutes.js";
import JobsRoute from "./Routes/JobsRoute.js";


const app=express();

//calling config fuction
dotenv.config();
ConnectDb();

//port
const port =process.env.PORT;

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());






//applying routing
app.use("/mainroute",router);//Auth route
app.use("/user/route",UserRouter)//User Route
app.use("/user/jobs/route",JobsRoute)//User Jobs route



//start server
const start=()=>{
    app.listen(port,(error)=>{
        console.log(`server listening at port ${port}`);
    });
}

start();