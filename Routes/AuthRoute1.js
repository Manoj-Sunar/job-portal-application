import express from "express";
import { userLogin, userRegister } from "../Controllers/authController.js";
import { userAuthentication } from "../Middlewares/AuthMiddleware.js";

 const router=express.Router();

router.post("/user/Register",userRegister);
router.post("/user/login",userAuthentication,userLogin);

export default router;
