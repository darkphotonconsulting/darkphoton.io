import AWS from 'aws-sdk'

export const listTables = async ({
  debug = true,
  filter = '.*'
}) => {
  const databaseClient = new AWS.DynamoDB({
    endpoint: new AWS.Endpoint(process.env.DYNAMODB_ENDPOINT)
  })
  if (debug) console.log('listing tables...')
  const data = await databaseClient.listTables().promise()
  const { TableNames } = data
  console.log(JSON.stringify(TableNames, null, 2))
}
