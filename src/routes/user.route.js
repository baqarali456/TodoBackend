import { Router } from "express";
import { adminChangeUserRole, changePassword, getadminAllUsers, getCurrentUser, getuserId, loginUser, logoutUser, refreshingrefreshToken, registerUser } from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"
const userRouter = Router()

userRouter.route('/register-user').post(registerUser)
userRouter.route('/login-user').post(loginUser)
userRouter.route('/logout-user').post(verifyJWT,logoutUser)
userRouter.route('/get-user').get(verifyJWT,getCurrentUser);
userRouter.route('/get-user/:userId').get(verifyJWT,getuserId);
userRouter.route('/refresh-token').post(refreshingrefreshToken);
userRouter.route('/changePassword').post(changePassword);
userRouter.route('/admin/getallUsers').get(isAdmin,getadminAllUsers);
userRouter.route('/admin/changeUserRole').patch(isAdmin,adminChangeUserRole);

export {userRouter}