import AWS from 'aws-sdk'

import { Data } from '../../data/Data.js'

export const seedTable = async ({
  table = 'darkphoton',
  hash = '_pk',
  range = '_sk',
  debug = false,
  data
}) => {
  const documentClient = new AWS.DynamoDB.DocumentClient({
    endpoint: new AWS.Endpoint(process.env.DYNAMODB_ENDPOINT)
  })
  data = data || Data
  if (data.type && data.type === 'seed') {
    if (!data.people) {
      throw new Error('no people in data')
    }
    if (!data.companies) {
      throw new Error('no companies in data')
    }
    const { people } = data
    for (const person of people) {
      console.log(`inserting person profile ${person.name}...`)
      const { name, profile } = person
      const profileItem = {
        TableName: table,
        Item: {
          _pk: `person#${person.name}`,
          _sk: 'profile',
          data: JSON.stringify(
            name,
            profile
          )
        }
      }
      await documentClient.put(profileItem).promise()
      const { contacts } = person
      for (const contact of contacts) {
        console.log(`inserting person contact ${contact.name}...`)
        const contactItem = {
          TableName: table,
          Item: {
            _pk: `person#${person.name}`,
            _sk: `contact#${contact.name}`,
            data: JSON.stringify(
              contact
            )
          }
        }
        await documentClient.put(contactItem).promise()
      }

      const { companies } = person
      for (const company of companies) {
        console.log(`inserting person company ${company.name}`)
        const companyItem = {
          TableName: table,
          Item: {
            _pk: `person#${person.name}`,
            _sk: `company#${company.name}`,
            data: JSON.stringify({
              ...company
            })
          }
        }
        await documentClient.put(companyItem).promise()
      }
      const { education } = person
      for (const school of education) {
        console.log(`inserting person education ${school.name}...`)
        const schoolItem = {
          TableName: table,
          Item: {
            _pk: `person#${person.name}`,
            _sk: `education#${school.name}`,
            data: JSON.stringify({
              school
            })
          }
        }
        await documentClient.put(schoolItem).promise()
      }
      const { employers } = person
      for (const employer of employers) {
        console.log(`inserting employer ${employer.name}`)
        const employerItem = {
          TableName: table,
          Item: {
            _pk: `person#${person.name}`,
            _sk: `employer#${employer.name}`,
            data: JSON.stringify({
              name: employer.name,
              city: employer.city,
              state: employer.state,
              country: employer.country || 'USA',
              start: `${employer.start}`,
              end: `${employer.end}`,
              employmentsHeld: employer.employment.length
            })
          }
        }
        await documentClient.put(employerItem).promise()
        // const { employment } = employer
        for (const employment of employer.employment) {
          console.log(`inserting employment employment ${employment.employmentName} `)
          const employmentItem = {
            TableName: table,
            Item: {
              _pk: `employer#${employer.name}`,
              _sk: `employment#${employment.employmentName}`,
              data: JSON.stringify({
                name: employment.employmentName,
                description: employment.employmentDescription,
                group: employment.employmentGroup,
                manager: employment.employmentManager,
                start: `${employment.startMonth}-${employment.startDay}-${employment.startYear}`,
                end: `${employment.endMonth}-${employment.endDay}-${employment.endYear}`,
                responsibilities: employment.employmentResponsibilities,
                milestones: employment.employmentMilestones
              })
            }
          }
          await documentClient.put(employmentItem).promise()
        }
      }
    }
  } else {
    throw new Error('data.type must be set to "seed"')
  }
}

await seedTable({})
