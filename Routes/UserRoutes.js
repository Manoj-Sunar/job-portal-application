import express from "express";
import { UserDataUpdates} from "../Controllers/UsersController.js";
import { userAuthentication } from "../Middlewares/AuthMiddleware.js";
const UserRouter=express.Router();

UserRouter.put("/user/update/:id",userAuthentication,UserDataUpdates);

export default UserRouter;