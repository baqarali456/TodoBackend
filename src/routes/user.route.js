import { Router } from "express";
import { getCurrentUser, getuserId, loginUser, logoutUser, refreshingrefreshToken, registerUser } from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"
const userRouter = Router()

userRouter.route('/register-user').post(registerUser)
userRouter.route('/login-user').post(loginUser)
userRouter.route('/logout-user').post(verifyJWT,logoutUser)
userRouter.route('/get-user').get(verifyJWT,getCurrentUser);
userRouter.route('/get-user/:userId').get(verifyJWT,getuserId);
userRouter.route('/refresh-token').post(refreshingrefreshToken);

export {userRouter}