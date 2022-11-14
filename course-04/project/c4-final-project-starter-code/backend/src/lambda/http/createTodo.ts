import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
//import * as uuid from 'uuid'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../helpers/dataLayer/todosAcess'
import { buildTodo } from '../../helpers/businessLogic/todos'
//import { getUserId } from '../utils';
//import { createTodo } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item

    const todo = buildTodo(newTodo, event);
    
    if(newTodo.name == null || newTodo.name == ""){
      const error = "Failed to created todo. the field name is empty"

      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({"error": error})
      }
    }else{
      const todoCreated = await createTodo(todo);

      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({"item": todoCreated})
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
