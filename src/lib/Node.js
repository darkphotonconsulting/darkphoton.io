// import AWS from 'aws-sdk'
const AWS = require('aws-sdk')
const EventEmitter = require('events')
// import EventEmitter from 'events'
class Node extends EventEmitter {
  #table = 'darkphoton'

  async #tables () {
    const tables = await this.dynamoClient.listTables().promise()
    return tables.TableNames
  }

  constructor ({
    table
  }) {
    super()
    this.table = table || this.#table
    this.dynamoClient = new AWS.DynamoDB({
      endpoint: new AWS.Endpoint(process.env.DYNAMODB_ENDPOINT)
    })
    this.documentClient = new AWS.DynamoDB.DocumentClient({
      endpoint: new AWS.Endpoint(process.env.DYNAMODB_ENDPOINT)
    })
  }

  async preflight () {
    const tables = await this.#tables()
    if (tables.includes(this.table)) {
      return true
    }
    return false
    // return tables.includes(this.table)
  }

  async scan () {
    if (await this.preflight()) {
      const params = {
        TableName: this.table
      }
      const result = await this.documentClient.scan(params).promise()
      return result.Items
    }
    throw new Error('Table does not exist')
  }

  async items ({
    pk = 'person#Aaron Samuel',
    sk = 'profile'
  }) {
    if (await this.preflight()) {
      const items = await this.scan()
      return items
        .filter(
          item =>
            new RegExp(pk).test(item._pk) && new RegExp(sk).test(item._sk)
        )
    } else {
      throw new Error('Table does not exist')
    }
  }
}

class People extends Node {
  #pkish = 'person'
  #skish = 'profile'

  constructor () {
    super({
      table: 'darkphoton'
    })
  }

  async items ({
    pk = this.#pkish,
    sk = this.#skish
  }) {
    return await super.items({
      pk,
      sk
    })
  }
}
class Person extends Node {
  #pk = 'person'
  #sk = '.*'
  constructor ({
    table,
    name = 'Aaron Samuel'
  }) {
    super({
      table: 'darkphoton'
    })
  }

  async items () {
    if (await this.preflight()) {
      const items = await this.scan()
      return items
        .filter(
          item =>
            new RegExp(this.#pk).test(item._pk) && new RegExp(this.#sk).test(item._sk)
        )
    } else {
      throw new Error('Table does not exist')
    }
  }
}

// class Companies extends Node {}
// class Company extends Node {}

// class Employers extends Node {}
// class Employer extends Node {}

// class Employments extends Node {}
// class Employment extends Node {}

// class Contacts extends Node {}
// class Contact extends Node {}

module.exports = {
  Node,
  People,
  Person
}
