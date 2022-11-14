import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
//import * as AWS from 'aws-sdk'
import { getAllTodoByUserId } from '../../helpers/dataLayer/todosAcess'
//import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders'

//import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos'
import { getUserId } from '../utils';

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    // Write your code here
    // get all todos from our todoAccess
    const todos = await getAllTodoByUserId(getUserId(event))

    return {
      statusCode: 200,
      headers: {
          "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
          "items": todos,
      }),
  }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
