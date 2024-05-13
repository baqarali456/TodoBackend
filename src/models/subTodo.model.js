import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const subtodoSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true,
    },
    complete:{
        type: Boolean,
        default: false
    }
    
   
},{timestamps:true});

subtodoSchema.plugin(mongooseAggregatePaginate)


export const SubTodo = mongoose.model("SubTodo",subtodoSchema)