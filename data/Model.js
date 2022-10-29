export const Table = ({
  name = 'darkphoton',
  hash = '_pk',
  range = '_sk'
}) => {
  return {
    TableName: name,
    AttributeDefinitions: [
      {
        AttributeName: hash,
        AttributeType: 'S'
      },
      {
        AttributeName: range,
        AttributeType: 'S'
      }
    ],
    KeySchema: [
      {
        AttributeName: hash,
        KeyType: 'HASH'
      },
      {
        AttributeName: range,
        KeyType: 'RANGE'
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    },
    StreamSpecification: {
      StreamEnabled: false
    }
  }
}
