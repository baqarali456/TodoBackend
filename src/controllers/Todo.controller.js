import { Todo } from "../models/Todo.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asynchandler";
import mongoose,{isValidObjectId} from "mongoose";

const addTodo = asyncHandler(async(req,res)=>{
    const {name} = req.body;
    if(!name?.trim()){
        throw new ApiError(401,"name is required") 
    }

   const todo = await Todo.create({
        name,
        createdBy:req.user?._id
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200,todo,"todo create successfully")
    )
})


const updateTodoById = asyncHandler(async(req,res)=>{
   try {
     const {todoId} = req.params;
     const {name} = req.body;
    const isValidtodoId = isValidObjectId(todoId);
    if(!isValidtodoId){
     throw new ApiError(401,"todoId is required");
    }
    if(!name?.trim()){
     throw new ApiError(401,"name is required");
    }
 
   const updatedTodo = await Todo.findByIdAndUpdate(
     todoId,
     {
         $set:{
             name,
         }
     },
     {
        new : true,
     }
    )
 
    return res
    .status(200)
    .json(
     new ApiResponse(200,updatedTodo,"update Todo Successfully")
    );
   } catch (error) {
    return res
    .status(500)
    .json(
        new ApiResponse(500,{},"something went wrong while updating Todo")
    )
   }


})
const getTodoById = asyncHandler(async(req,res)=>{
   try {
     const {todoId} = req.params;
     
    const isValidtodoId = isValidObjectId(todoId);
    if(!isValidtodoId){
     throw new ApiError(401,"todoId is required");
    }
    
 
   const getTodo = await Todo.findById(
     todoId,
    )
 
    return res
    .status(200)
    .json(
     new ApiResponse(200,getTodo,"get Todo Successfully")
    );
   } catch (error) {
    return res
    .status(500)
    .json(
        new ApiResponse(500,{},"something went wrong while getting Todo")
    )
   }


})


const deleteTodoById = asyncHandler(async(req,res)=>{
    const {todoId} = req.params;
     
    const isValidtodoId = isValidObjectId(todoId);
    if(!isValidtodoId){
     throw new ApiError(401,"todoId is not valid");
    }

    const deletedTodo = await Todo.deleteOne({_id:todoId});
    if(!deletedTodo){
        throw new ApiError(500,"something went wrong while deleting Todo")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,deletedTodo,"successfully delete Todo")
    );

})

const getallSubTodoinMainTodo = asyncHandler(async(req,res)=>{

    const {todoId} = req.params;
    const {page=1,limit=10} = req.query;
    const isValidtodoId = isValidObjectId(todoId);
    if(!isValidtodoId){
     throw new ApiError(401,"todoId is not valid");
    }

   const allsubTodoaggregate = await Todo.aggregate([
        {
            $match:{
                _id:new mongoose.Schema.Types.ObjectId(todoId)
            }
        },
        {
            $lookup:{
                from:"subtodos",
                localField:"subTodo",
                foreignField:"_id",
                as:"subTodo",
            }
        }
    ])

   const allSubTodoinMajorTodo = await Todo.aggregatePaginate(
        allsubTodoaggregate,
        {
            page:Math.max(page,1),
            limit:Math.max(limit,1),
            pagination:true,
            customLabels:{
              totalDocs:"totalSubTodobyquery",
              totalPages:true,
              pagingCounter:true,
              docs:"totalallsubTodo"
            }
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,allSubTodoinMajorTodo,"get successfully all subTodo in major Todo")
    )
})


export {
    addTodo,
    updateTodoById,
    getTodoById,
    deleteTodoById,
    getallSubTodoinMainTodo
}