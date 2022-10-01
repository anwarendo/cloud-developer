import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';


const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE

export async function createItem(newItem) {
  console.log('Storing new item: ', newItem)

  await docClient
  .put({
    TableName: todosTable,
    Item: newItem
  })
  .promise()
}  

export async function getItem(userId: string) {
  const result = await docClient.get({
      TableName: todosTable,
      Key: {
        id: userId
      }
    }).promise()
  return result
}  

