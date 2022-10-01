import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as uuid from 'uuid'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
// import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo, userExists } from '../../helpers/todos'
import { getUploadUrl } from '../../helpers/attachmentUtils'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Implement creating a new TODO item
  console.log('Caller event', event)
  const userId = getUserId(event)
  const validUserId = await userExists(userId)

  if (!validUserId) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'User does not exist'
      })
    }
  }
  const todoId = uuid.v4()
  const newItem = await createTodo(userId, todoId, event)

  const url = getUploadUrl(todoId)

  return {
    statusCode: 201,
    body: JSON.stringify({
      newItem: newItem,
      uploadUrl: url
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)



