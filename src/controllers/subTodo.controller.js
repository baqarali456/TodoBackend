import mongoose,{isValidObjectId} from "mongoose";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError";
import { SubTodo } from "../models/subTodo.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const addSubTodo = asyncHandler(async(req,res)=>{
    const {content} = req.body;
    if(content?.trim()){
        throw new ApiError(401,"content is required");
    }

   const subtodo =  await SubTodo.create({
        content,
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200,subtodo,"create subTodo successfully")
    )
})

const updateSubTodoById = asyncHandler(async(req,res)=>{
    const {subTodoId} = req.params;
    const {content,complete} = req.body;
    const isValidsubTodoId = isValidObjectId(subTodoId);
    if(!isValidsubTodoId){
     throw new ApiError(401,"subtodoId is not valid");
    }
    if(!content?.trim()){
        throw new ApiError(401,"content is required")
    }

  const updatedsubTodo =  await SubTodo.findByIdAndUpdate(
        subTodoId,
        {
            $set:{
                content,
                complete,
            }
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,updatedsubTodo,"updatedsubTodo Successfully")
    )
})

const deleteSubTodoById = asyncHandler(async(req,res)=>{
    const {subTodoId} = req.params;
    const isValidsubTodoId = isValidObjectId(subTodoId);
    if(!isValidsubTodoId){
     throw new ApiError(401,"subtodoId is not valid");
    }

   const deletedsubTodo = await subTodoId.deleteOne({_id:subTodoId})
   if(!deletedsubTodo){
    throw new ApiError(500,"something went wrong while deleting subTodo")
   }

   return res
   .status(200)
   .json(
    new ApiResponse(200,deletedsubTodo,"successfully deleted subTodo")
   )
})

const getSubTodoById = asyncHandler(async(req,res)=>{
    const {subTodoId} = req.params;
    const isValidsubTodoId = isValidObjectId(subTodoId);
    if(!isValidsubTodoId){
     throw new ApiError(401,"subtodoId is not valid");
    }

   const getSubTodo = await SubTodo.findById(subTodoId)

   return res
   .status(200)
   .json(
    new ApiResponse(200,getSubTodo,"get getsubTodo successfully By id")
   )
})


export {addSubTodo,updateSubTodoById,getSubTodoById,deleteSubTodoById,getSubTodoById}