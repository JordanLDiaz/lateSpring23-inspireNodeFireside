import { Auth0Provider } from "@bcwdev/auth0provider";
import BaseController from "../utils/BaseController.js";
import { todosService } from "../services/TodosService.js";

export class TodosController extends BaseController {
  constructor() {
    super('/api/todos')
    this.router
      // NOTE in order to even get todos, we must be authorized/logged in, so put the .use above all CRUD routes
      .use(Auth0Provider.getAuthorizedUserInfo)
      .get('', this.getAllTodos)
      .post('', this.createTodo)
      .put('/:todoId', this.editTodo)
      .delete('/:todoId', this.deleteTodo)
  }
  async getAllTodos(request, response, next) {
    try {
      // NOTE think of query like a search. req.query creates an empty object, attaching the creatorId to it (which is a banana word), creates a key value pair that assigns the creatorId to the userInfo.id
      request.query.creatorId = request.userInfo.id
      const todos = await todosService.getAllTodos(request.query)
      return response.send(todos)
    } catch (error) {
      next(error)
    }
  }

  async createTodo(req, res, next) {
    try {
      const todoData = req.body
      // NOTE grab the id from the user making the request and assign it to the todo being created
      req.body.creatorId = req.userInfo.id
      const newTodo = await todosService.createTodo(todoData)
      return res.send(newTodo)
    } catch (error) {
      next(error)
    }
  }

  async editTodo(req, res, next) {
    try {
      const todoData = req.body
      // NOTE you are editing a todo, so a todo that has a todoId needs to equal the todoId that is passed in as a parameter 
      const todoId = req.params.todoId
      const userId = req.userInfo.id
      const updatedTodo = await todosService.editTodo(todoData, todoId, userId)
      return res.send(updatedTodo)
    } catch (error) {
      next(error)
    }
  }
  async deleteTodo(req, res, next) {
    try {
      // NOTE just as we grab the todoId from the params in an edit, we need to do the same for our delete
      const todoId = req.params.todoId
      const userId = req.userInfo.id
      await todosService.deleteTodo(todoId, userId)
      return res.send('This todo has been deleted')
    } catch (error) {
      next(error)
    }
  }
}