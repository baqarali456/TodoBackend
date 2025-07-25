import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const todoSchema = new mongoose.Schema({
    Title:{
        type: String,
        required: true,
    },
    DueDate:{
        type:Date,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        index:true,
    },
    Description:{
        type:String,
        max:500,
    },
    Category:{
        type:String,
        enum:["Urgent","Non-Urgent"],
        default:"Non-Urgent",
    },
    complete:{
        type:Boolean,
        default:false,
    },
},{timestamps:true});


todoSchema.plugin(mongooseAggregatePaginate)
export const Todo = mongoose.model("Todo",todoSchema)