import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {  addTodo, deleteTodoById, getTodoById,  getallUserTodos, updateTodoById, adminGetAllUserTodos } from "../controllers/Todo.controller.js";
import { isAdmin } from "../middlewares/admin.middleware.js";


const todoRouter = Router()

todoRouter.use(verifyJWT);

todoRouter.route('/add-todo').post(addTodo);
todoRouter.route('/update-todo/:todoId').patch(updateTodoById);
todoRouter.route('/get-todo/:todoId').get(getTodoById);
todoRouter.route('/delete-todo/:todoId').delete(deleteTodoById);
todoRouter.route('/getAll-userTodos').get(getallUserTodos);
todoRouter.route('/admin/getadminallUserTodos').get(isAdmin,adminGetAllUserTodos);


export {todoRouter};