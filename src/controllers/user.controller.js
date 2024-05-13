import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";


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

    return res
        .status(200)
        .json(
            new ApiResponse(200, registeringUser, "User successfully registered")
        )

})

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if ([username, password, email].some(field => field?.trim() === "")) {
        throw new ApiError(401, "all Fields are required")
    }

   const user = await User.findOne({
        $and:[{username},{email}]
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
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",newRefreshToken,options)
   .json(
    new ApiResponse(200,loggedInUser,"user successfully login")
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

export { registerUser,loginUser }
