import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
//import { createLogger } from '../utils/logger'
import { TodoItem } from '../../models/TodoItem'
import { TodoUpdate } from '../../models/TodoUpdate'

const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS)
//const logger = createLogger('TodosAccess')
const docClient: DocumentClient = createDynamoDBClient()
const todosTable = process.env.TODOS_TABLE
const index = process.env.TODOS_CREATED_AT_INDEX

// TODO: Implement the dataLayer logic 

  // Get all todos created by a specific user
  export async function getAllTodoByUserId(userId: string): Promise<TodoItem[]>{
    const result = await docClient.query({
      TableName: todosTable,
      KeyConditionExpression: "#userId = :userId",
      ExpressionAttributeNames: {
          "#userId": "userId"
      },
      ExpressionAttributeValues: {
          ":userId": userId
      }
    }).promise()

    return result.Items as TodoItem[]
  }


  // create todo
  export async function createTodo(todo: TodoItem): Promise<TodoItem> {
    await docClient.put({
      TableName: todosTable,
      Item: todo
    }).promise()
    return todo as TodoItem
  }

  // update todo
  export async function updatesTodo(todoUpdate: TodoUpdate, todo: TodoItem): Promise<TodoUpdate> {
    const result = await docClient.update({
      TableName: todosTable,
      Key: {
        "userId": todo.userId,
        "todoId": todo.todoId
      },
      UpdateExpression: "set #a = :a, #b = :b, #c = :c",
      ExpressionAttributeNames: {
          "#a": "name",
          "#b": "dueDate",
          "#c": "done"
      },
      ExpressionAttributeValues: {
          ":a": todoUpdate['name'],
          ":b": todoUpdate['dueDate'],
          ":c": todoUpdate['done']
      },
      ReturnValues: "ALL_NEW"
    }).promise()

    const attributes = result.Attributes

    return attributes as TodoUpdate
  }

  // get a specific todo by his id
  export async function getTodoById(todoId: string): Promise<TodoItem>{
    const result = await docClient.query({
      TableName: todosTable,
      IndexName: index,
      KeyConditionExpression: 'todoId = :todoId',
      ExpressionAttributeValues:{
        ':todoId': todoId
      }
    }).promise()

    const items = result.Items

    if(items.length !== 0) return result.Items[0] as TodoItem

    return null
  }

  // update todo
  export async function updateTodo(todo: TodoItem): Promise<TodoItem>{
    const result = await docClient.update({
      TableName: todosTable,
      Key:{
        userId: todo.userId,
        todoId: todo.todoId     
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues:{
        ':attachmentUrl': todo.attachmentUrl
      }
    }).promise()

    return result.Attributes as TodoItem 
  }

  // delete todo
  export async function deleteTodo(todo: TodoItem): Promise<string>{
    const result = await docClient.delete({
      TableName: todosTable,
      Key: {
        "userId": todo.userId,
        "todoId": todo.todoId
    },
    }).promise()

    console.log(result)

    return "" as string
  }

  // create database
  function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }