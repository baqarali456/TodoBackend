import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    markasDone:{
     type:Boolean,
     default:false,
    },
    subTodo:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubTodo"
        }
    ],
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
},{timestamps:true});


export const Todo = mongoose.model("Todo",todoSchema)