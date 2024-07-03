import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async(req,res,next)=>{
  const userAccessToken = req.cookies?.accessToken || req.header('Authorization').replace("Bearer ","")
  console.log(userAccessToken)
  if(!userAccessToken){
    throw new ApiError(401,"unauthorized request")
  }

  const decodedToken = jwt.verify(userAccessToken,process.env.ACCESS_TOKEN_SECRET);
  console.log(decodedToken)

  const user = await User.findById(decodedToken._id);
  if(!user){
    throw new ApiError(404,"invalid accessToken");
  }

  req.user = user;
  next();

})

export {verifyJWT}