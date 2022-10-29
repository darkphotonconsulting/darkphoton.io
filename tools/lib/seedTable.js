import AWS from 'aws-sdk'

import { Data } from '../../data/Data.js'

// const handlePrerequisites = ({
//   data = Data
// }) => {
//   if (Object.keys(data).length === 0) {
//     return false
//   }
//   if (data.type !== 'seed') {
//     return false
//   }

//   if (!data.people) {
//     return false
//   }

//   if (!data.people.length) {
//     return false
//   }
//   return true
// }
// const handleProfile = ({}) => { return }
// const handleContacts = ({data}) => {}
// const handleCompanies = ({data}) => {}
// const handleEducation = ({data}) => {}
// const handleEmployers = ({data}) => {}
// const handleEmployment = ({data}) => {}
// const handleResponsibilities = ({data}) => {}
// const handleSkills = ({data}) => {}

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
    if (!data.people || !data.people.length || data.people.length === 0) {
      throw new Error('people not defined')
    }

    /* people (top) */
    const { people } = data
    for (const person of people) {
      console.log(`insert person ${person.name} ...`)
      const { name, profile } = person
      const profileItem = {
        TableName: table,
        Item: {
          _pk: `person#${person.name}`,
          _sk: 'profile',
          data: JSON.stringify(
            name,
            {
              ...profile,
              employers: person.employers.length,
              companies: person.companies.length,
              contacts: person.contacts.length
            }
          )
        }
      }
      await documentClient.put(profileItem).promise()

      /* contacts */
      const { contacts } = person
      for (const contact of contacts) {
        console.log(`insert [${person.name}] contact ${contact.name} ... `)
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

      /* companies */
      const { companies } = person
      for (const company of companies) {
        console.log(`insert [${person.name}] company ${company.name} ...`)
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
      /* education */
      const { education } = person
      for (const school of education) {
        console.log(`inserting [${person.name}] education ${school.name} ...`)
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
      /* employers */
      const { employers } = person
      for (const employer of employers) {
        console.log(`inserting [${person.name}] employer ${employer.name} ...`)
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
              end: `${employer.end}`
              // employmentsHeld: employer.employment.length
            })
          }
        }
        await documentClient.put(employerItem).promise()

        /* employment */
        for (const employment of employer.employment) {
          console.log(`inserting [${person.name}] employment ${employment.name} `)
          const employmentItem = {
            TableName: table,
            Item: {
              _pk: `employer#${employer.name}`,
              _sk: `employment#${employment.name}`,
              data: JSON.stringify({
                name: employment.name,
                description: employment.description,
                group: employment.group,
                manager: employment.manager,
                start: employer.start,
                end: employer.end
                // responsibilities: employment.responsibilities,
                // highlights: employment.highlights
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
