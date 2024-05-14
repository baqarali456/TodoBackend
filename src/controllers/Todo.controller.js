import { Todo } from "../models/Todo.model.js";
import { SubTodo } from "../models/subTodo.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import mongoose, { isValidObjectId } from "mongoose";

const addTodo = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name?.trim()) {
        throw new ApiError(401, "name is required")
    }

    const todo = await Todo.create({
        name,
        createdBy: req.user?._id
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, todo, "todo create successfully")
        )
})


const updateTodoById = asyncHandler(async (req, res) => {
    try {
        const { todoId } = req.params;
        const { name, complete } = req.body;
        const isValidtodoId = isValidObjectId(todoId);
        if (!isValidtodoId) {
            throw new ApiError(401, "todoId is required");
        }
        if (!name?.trim()) {
            throw new ApiError(401, "name is required");
        }

        const updatedTodo = await Todo.findByIdAndUpdate(
            todoId,
            {
                $set: {
                    name,
                    complete,
                }
            },
            {
                new: true,
            }
        )

        return res
            .status(200)
            .json(
                new ApiResponse(200, updatedTodo, "update Todo Successfully")
            );
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiResponse(500, {}, "something went wrong while updating Todo")
            )
    }


})
const getTodoById = asyncHandler(async (req, res) => {
    try {
        const { todoId } = req.params;

        const isValidtodoId = isValidObjectId(todoId);
        if (!isValidtodoId) {
            throw new ApiError(401, "todoId is required");
        }


        const getTodo = await Todo.findById(todoId)

        return res
            .status(200)
            .json(
                new ApiResponse(200, getTodo, "get Todo Successfully")
            );
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiResponse(500, {}, "something went wrong while getting Todo")
            )
    }


})

const addSubtodoinMajorTodo = asyncHandler(async(req,res)=>{
    const {todoId,subTodoId} = req.params;
    const isValidtodoId = isValidObjectId(todoId);
        if (!isValidtodoId) {
            throw new ApiError(401, "todoId is required");
        }
        const isValidsubTodoId = isValidObjectId(subTodoId);
        if (!isValidsubTodoId) {
            throw new ApiError(401, "subTodoId is required");
        }

      const majorTodo = await Todo.findById(todoId)
      majorTodo.subTodo.push(subTodoId);
     await majorTodo.save({validateBeforeSave:false})

     return res
     .status(200)
     .json(new ApiResponse(200,majorTodo,"successfully add SubTodo in Todo"));
})


const deleteTodoById = asyncHandler(async (req, res) => {
    const { todoId } = req.params;

    const isValidtodoId = isValidObjectId(todoId);
    if (!isValidtodoId) {
        throw new ApiError(401, "todoId is not valid");
    }

    const deletedTodo = await Todo.deleteOne({ _id: todoId });
    if (!deletedTodo) {
        throw new ApiError(500, "something went wrong while deleting Todo")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, deletedTodo, "successfully delete Todo")
        );

})

const getallSubTodosinMainTodo = asyncHandler(async (req, res) => {

    const { todoId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const isValidtodoId = isValidObjectId(todoId);
    if (!isValidtodoId) {
        throw new ApiError(401, "todoId is not valid");
    }

    const mainTodo = await Todo.findById(todoId,{name:1});

    const allsubTodoaggregate = await Todo.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(todoId)
            }
        },
        {
            $lookup: {
                from: "subtodos",
                localField: "subTodo",
                foreignField:"_id",
                as:"subTodo",
                pipeline:[
                    {
                        $project:{
                            content:1,
                            complete:1,
                        }
                    }
                ]
            }
        }
    ])

    const allSubTodoinMajorTodo = await SubTodo.aggregatePaginate(
        allsubTodoaggregate,
        {
            page: Math.max(page, 1),
            limit: Math.max(limit, 1),
            pagination: true,
            customLabels: {
                totalDocs: "totalSubTodobyquery",
                totalPages: true,
                pagingCounter: true,
                docs: "totalallsubTodo"
            }
        }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, {mainTodo:mainTodo,allSubTodoinMajorTodo}, "get successfully all subTodo in major Todo")
        )
})

const getallUserTodos = asyncHandler(async (req, res) => {
    const allTodos = await Todo.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"subtodos",
                localField:"subTodo",
                foreignField:"_id",
                as:"subTodo",
                pipeline:[
                    {
                        $project:{
                            content:1,
                            complete:1,
                        }
                    }
                ]
            }
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(200, allTodos, "successfully fetched all Todos of User")
        );
})


export {
    addTodo,
    updateTodoById,
    getTodoById,
    deleteTodoById,
    getallSubTodosinMainTodo,
    getallUserTodos,
    addSubtodoinMajorTodo,
}