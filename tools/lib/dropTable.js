import AWS from 'aws-sdk';

export const dropTable = async ({
  name = 'darkphoton',
  debug = false,
}) => {
  if (debug) console.log(`dropping table ${name}...`);
  const databaseClient = new AWS.DynamoDB({
    endpoint: new AWS.Endpoint(process.env.DYNAMODB_ENDPOINT)
  })
  const run = async () => {
    try {
      console.log(`Deleting table ${process.env.DYNAMODB_TABLE_NAME}...`);
      const data = await databaseClient.deleteTable({
        TableName: name
      }).promise();
      console.log(data);
      return data
    } catch (err) {
      console.log(err)
    }
  }
  await run();
}
