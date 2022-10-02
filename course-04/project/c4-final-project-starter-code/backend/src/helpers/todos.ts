// import { TodosAccess } from './todosAcess'
import { createItem, getItem, getItemsPerUser} from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

// TODO: Implement businessLogic
const bucketName = process.env.TODOS_S3_BUCKET

export async function userExists(userId: string) {
  const result = await getItem(userId)

  console.log('Get user: ', result)
  return !!result.Item
}

export async function createTodo(userId: string, todoId: string, event: any) {
  const createdAt = new Date().toISOString()
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  
  const newItem = {
    userId,
    todoId,
    createdAt,
    ...newTodo,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
  }
  await createItem(newItem)

  return newItem
}

export async function getTodosForUser(userId: string) {
  
  const result = await getItemsPerUser(userId)

  return result.Items
}