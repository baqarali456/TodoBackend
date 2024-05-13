import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addSubtodoinMajorTodo, addTodo, deleteTodoById, getTodoById, getallSubTodosinMainTodo, getallUserTodos, updateTodoById } from "../controllers/Todo.controller.js";
import { addSubTodo } from "../controllers/subTodo.controller.js";

const todoRouter = Router()

todoRouter.use(verifyJWT);

todoRouter.route('/add-todo').post(addTodo);
todoRouter.route('/update-todo/:todoId').patch(updateTodoById);
todoRouter.route('/get-todo/:todoId').get(getTodoById);
todoRouter.route('/delete-todo/:todoId').delete(deleteTodoById);
todoRouter.route('/getAll-subTodosinMajorTodo/:todoId').get(getallSubTodosinMainTodo);
todoRouter.route('/getAll-userTodos').get(getallUserTodos);
todoRouter.route('/addSubTodo-in-todo/:todoId/:subTodoId').post(addSubtodoinMajorTodo);

export {todoRouter};