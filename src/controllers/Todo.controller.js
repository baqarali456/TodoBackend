import { Todo } from "../models/Todo.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import mongoose, { isValidObjectId } from "mongoose";

const addTodo = asyncHandler(async (req, res) => {
        const { Title,Description=null,Category='Non-Urgent',complete=false, } = req.body;
        if (!Title?.trim()) {
            throw new ApiError(401, "Title is required")
        }
    
        const todo = await Todo.create({
            Title,
            Description,
            Category,
            complete,
            createdBy: req.user?._id
        })
    
        return res
            .status(200)
            .json(
                new ApiResponse(200, todo, "todo create successfully")
            )
    
})


const updateTodoById = asyncHandler(async (req, res) => {
    
        const { todoId } = req.params;
        const { Title,Description,Category,complete } = req.body;
        const isValidtodoId = isValidObjectId(todoId);
        if (!isValidtodoId) {
            throw new ApiError(401, "todoId is required");
        }
        if (!Title?.trim()) {
            throw new ApiError(401, "Title is required");
        }

        const todo = await Todo.findOne({ _id: todoId, createdBy: req.user._id });

        if (req.user?.role === 'user') {
            if (todo.createdBy.toString() !== req.user._id.toString()) {
                throw new ApiError(401, "You are not authorized to update this todo");
            }
        }

        const updatedTodo = await Todo.findByIdAndUpdate(
            todoId,
            {
                $set: {
                    Title,
                    Description,
                    Category,
                    complete
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
    


})
const getTodoById = asyncHandler(async (req, res) => {
    
        const { todoId } = req.params;

        const isValidtodoId = isValidObjectId(todoId);
        if (!isValidtodoId) {
            throw new ApiError(401, "todoId is required");
        }

        const todo = await Todo.findOne({ _id: todoId, createdBy: req.user._id });

        if (todo.createdBy.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "You are not authorized to get this todo");
        }

        const getTodo = await Todo.findById(todoId)

        return res
            .status(200)
            .json(
                new ApiResponse(200, getTodo, "get Todo Successfully")
            );
    


})




const deleteTodoById = asyncHandler(async (req, res) => {
    
        const { todoId } = req.params;
    
        const isValidtodoId = isValidObjectId(todoId);
        console.log(isValidtodoId)
        if (!isValidtodoId) {
            throw new ApiError(401, "todoId is not valid");
        }
    
    
        const todo = await Todo.findOne({ _id: todoId, createdBy: req.user._id });
    
        if (req.user?.role === 'user') {
            if (todo.createdBy.toString() !== req.user._id.toString()) {
                throw new ApiError(403, "You are not authorized to delete this todo");
            }
        }
        if (!todo) {
            throw new ApiError(404, "todo not found")
        }
    
    
        const deletedTodo = await Todo.deleteOne({ _id: todoId });
        if (!deletedTodo) {
            throw new ApiError(404, "todo doesn't exist")
        }
    
        return res
            .status(200)
            .json(
                new ApiResponse(200, deletedTodo, "successfully delete Todo")
            );
    

})



const adminGetAllUserTodos = asyncHandler(async (req, res) => {

    const { page = 1, limit = 10 } = req.query;
    const alluserTodos = await Todo.aggregate([
        {
            $match: {
               createdBy: new mongoose.Types.ObjectId(req.user._id)
            }
        }
    ])

    const admin_getalluserTodos = await Todo.aggregatePaginate(alluserTodos, {
        page: page || 1,
        limit: limit || 10,
        sort: { createdAt: -1 },
        customLabels: {
            docs: 'todos',
            totalDocs: 'totalTodos',
            limit: 'perPage',
            page: 'currentPage',
        },
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, admin_getalluserTodos, "successfully fetched all Todos of Users")
        );
})

const getallUserTodos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const allTodos = await Todo.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "subtodos",
                localField: "subTodo",
                foreignField: "_id",
                as: "subTodo",
                pipeline: [
                    {
                        $project: {
                            content: 1,
                            complete: 1,
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "createdBy",
                pipeline: [
                    {
                        $project: {
                            userTitle: 1,
                        }
                    }
                ]
            }
        }
    ])


    const aggregatedTodos = await Todo.aggregatePaginate(allTodos, {
        page: page || 1,
        limit: limit || 10,
        sort: { createdAt: -1 },
        customLabels: {
            docs: 'todos',
            totalDocs: 'totalTodos',
            limit: 'perPage',
            page: 'currentPage',
        },
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, aggregatedTodos, "successfully fetched all Todos of User")
        );
})




export {
    addTodo,
    updateTodoById,
    getTodoById,
    deleteTodoById,
    getallUserTodos,
    adminGetAllUserTodos,
}