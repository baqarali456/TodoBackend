import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";


const registerUser = asyncHandler(async (req, res) => {
    const { username, password, email } = req.body;
    if ([username, password, email].some(field => field?.trim() === "")) {
        throw new ApiError(401, "all Fields are required")
    }
    // check already user register;

    const ExistingUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (ExistingUser) {
        throw new ApiError(400, "user already register")
    }

    const registeringUser = await User.create({
        username,
        email,
        password,
    })

    // send response

    return res
        .status(200)
        .json(
            new ApiResponse(200, registeringUser, "User successfully registered")
        )

})

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if(!username && !email){
     throw new ApiError(401,"username or email is required")
    }

   const user = await User.findOne({
        $or:[{username},{email}]
    })
    if(!user){
        throw new ApiError(404,"user not register")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)
   if(!isPasswordValid){
    throw new ApiError(401,"password is wrong")
   }

  const accessToken = user.generateAccessToken()
   const newRefreshToken = user.generateRefreshToken()
   user.refreshToken = newRefreshToken;
   await user.save({validateBeforeSave:false});
   
  const loggedInUser =  await User.findById(user._id).select(" -password -refreshToken")
  console.log(loggedInUser)
  

   const options = {
    httpOnly:true,
    secure:true,
   }

   
   
   return res
   .status(200)
   .cookie('accessToken',accessToken,options)
   .cookie("refreshToken",newRefreshToken,options)
   .json(
       new ApiResponse(200,{user:loggedInUser,accessToken:accessToken,refreshToken:newRefreshToken},"user successfully login")
    )
    
    
})


const logoutUser = asyncHandler(async(req,res)=>{
   await User.findByIdAndUpdate(
    req.user._id,
    {
        $unset:{
            refreshToken:1
        }
    }
   );

   const options = {
    httpOnly:true,
    secure:true,
   }

   return res
   .status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(
    new ApiResponse(200,{},"user logout successfully")
   );


})

const getCurrentUser = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id).select(
        "-password -refreshToken"
    )
    console.log(user)
    if(!user){
        throw new ApiError(404,"user doesn't exist")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,user,"get user successsfully"))
})

const getuserId = asyncHandler(async(req,res)=>{
    const {userId} = req.params
   const user = await User.findById(userId)
   return res.status(200).json(
    new ApiResponse(200,user,"get user by id")
   )
})

const refreshingrefreshToken = asyncHandler(async(req,res)=>{
  
    const incomingToken = req.cookies?.refreshToken || req.body.refreshToken
    if(!incomingToken){
        throw new ApiError(404,"unauthorized request")
    }

   const decodedToken = jwt.verify(incomingToken,process.env.REFRESH_TOKEN_SECRET)

   const user = await User.findById(decodedToken._id)
   if(incomingToken !== user.refreshToken){
    throw new ApiError(404,"invalid token")
   }

  const accessToken = user.generateAccessToken()
  const refreshToken = user.generateRefreshToken()
  await user.save()

  const options = {
    httpOnly:true,
    secure:true
  }

  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new
    ApiResponse(200,{accessToken:accessToken,refreshToken:refreshToken},"successfully refresh refreshToekn")
  )

})

export { registerUser,loginUser,logoutUser,getCurrentUser,getuserId,refreshingrefreshToken }
