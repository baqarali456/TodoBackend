import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const todoSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    complete:{
     type: Boolean,
     default: false,
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


todoSchema.plugin(mongooseAggregatePaginate)
export const Todo = mongoose.model("Todo",todoSchema)