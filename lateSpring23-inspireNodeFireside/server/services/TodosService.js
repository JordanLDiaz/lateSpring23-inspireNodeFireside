import { dbContext } from "../db/DbContext.js";
import { BadRequest, Forbidden } from "../utils/Errors.js";

class TodosService {
  // NOTE service's job is now to send request off to our db
  // NOTE find method says I'm going to pass you an object, and I want you to return to me everything from this collection that matches the properties of this object
  // NOTE we pass in the query which we know contains our creatorId key value pair to help us find all the todos connected to this creatorId
  async getAllTodos(query) {
    const todos = await dbContext.Todos.find(query)
    return todos
  }

  async createTodo(todoData) {
    const newTodo = await dbContext.Todos.create(todoData)
    return newTodo
  }

  // NOTE we sent the body of the edit to the service, and now we need to find that specific todo in the db using the todoId associated with the body that was sent through
  async editTodo(todoData, todoId, userId) {
    const originalTodo = await dbContext.Todos.findById(todoId)
    // NOTE check that there is a todo with that id
    if (!originalTodo) {
      throw new BadRequest('No todo at this id.')
    }
    //NOTE Check that the user making the request is the one who made the todo
    if (originalTodo.creatorId != userId) {
      throw new Forbidden('You do not have permission to edit this todo!')
    }
    originalTodo.description = todoData.description ? todoData.description : originalTodo.description
    originalTodo.completed = todoData.completed || originalTodo.completed
    await originalTodo.save()
    return originalTodo
  }

  async deleteTodo(todoId, userId) {
    const todo = await dbContext.Todos.findById(todoId)
    if (!todo) {
      throw new BadRequest('No todo at this id.')
    }
    if (todo.creatorId != userId) {
      throw new Forbidden('You do not have permission to delete this todo!')
    }
    await todo.delete()
    return
  }
}

export const todosService = new TodosService();