import AWS from 'aws-sdk'
import { Params } from '../data/Params.js'

export const createTable = async ({
  name = 'darkphoton',
  hash = '_pk',
  range = '_sk',
  debug = false
}) => {
  if (debug) console.log(`creating table ${name} with hash key ${hash} and range key ${range}...`)
  const databaseClient = new AWS.DynamoDB({
    endpoint: new AWS.Endpoint(process.env.DYNAMODB_ENDPOINT)
  })

  const params = Params({
    name,
    hash,
    range
  })

  const run = async () => {
    try {
      console.log(`Creating table ${params.TableName}...`)
      const data = await databaseClient.createTable(params).promise()
      console.log(data)
      return data
    } catch (err) {
      console.log(err)
    }
  }

  await run()
}
