import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addSubTodo, deleteSubTodoById, getSubTodoById, updateSubTodoById } from "../controllers/subTodo.controller.js";

const subTodoRouter = Router()

subTodoRouter.use(verifyJWT);

subTodoRouter.route('/add-subTodo').post(addSubTodo)
subTodoRouter.route('/update-subTodo/:subTodoId').patch(updateSubTodoById)
subTodoRouter.route('/get-subTodo/:subTodoId').get(getSubTodoById)
subTodoRouter.route('/delete-subTodo/:subTodoId').delete(deleteSubTodoById);


export {subTodoRouter};