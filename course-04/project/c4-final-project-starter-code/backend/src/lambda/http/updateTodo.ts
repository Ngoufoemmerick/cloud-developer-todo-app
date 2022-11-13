import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

//import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getTodoById, updatesTodo } from '../../helpers/todosAcess'
//import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

    // get todo by id
    const todo = await getTodoById(todoId)

    // get updated todo
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    const toDoItem = await updatesTodo(updatedTodo, todo);


    return {
      statusCode: 200,
      headers: {
          "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
          "item": toDoItem
      }),
  }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
