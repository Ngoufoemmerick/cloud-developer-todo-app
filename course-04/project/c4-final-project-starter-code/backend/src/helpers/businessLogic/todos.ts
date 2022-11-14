//import { TodosAccess } from './todosAcess'
//import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../../models/TodoItem'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
//import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
//import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'
import { getUserId } from '../../lambda/utils';


// TODO: Implement businessLogic
export function buildTodo(todoRequest: CreateTodoRequest, event): TodoItem{
    const s3BucketName = process.env.S3_BUCKET_NAME;
    const todoId =  uuid.v4();

    const todo = {
        todoId: todoId,
        createdAt: new Date().toISOString(),
        userId: getUserId(event),
        done: false,
        attachmentUrl:  `https://${s3BucketName}.s3.amazonaws.com/${todoId}`, 
        ...todoRequest
    }

    return todo as TodoItem
}