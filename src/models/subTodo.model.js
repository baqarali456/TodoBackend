import mongoose from "mongoose";

const subtodoSchema = new mongoose.Schema({
    content:{
        name:String,
        required:true,
    },
    complete:{
        type:Boolean,
        default:false
    },
},{timestamps:true});


export const SubTodo = mongoose.model("SubTodo",subtodoSchema)