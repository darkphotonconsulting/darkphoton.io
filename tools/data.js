import { Command } from 'commander'
import {
  listTables
} from './lib/listTables.js'
import {
  createTable
} from './lib/createTable.js'
import {
  dropTable
} from './lib/dropTable.js'
const program = new Command()

program
  .version('0.0.1')
  .description('DarkPhoton Data Model CLI')

program
  .command('list')
  .description('list tables')
  .option('-d, --debug', 'output extra debugging', false)
  .option('-f, --filter <filter>', 'filter table names', '.*')
  .action((options) => {
    listTables({
      debug: options.debug,
      filter: options.filter
    })
  })

program
  .command('create')
  .description('create the table')
  .option('-d, --debug', 'output extra debugging', false)
  .option('-n, --name <name>', 'table name', 'darkphoton')
  .option('-h, --hash <hash>', 'hash key', '_pk')
  .option('-r, --range <range>', 'range key', '_sk')
  .action(async (options) => {
    createTable({
      debug: options.debug,
      name: options.name,
      hash: options.hash,
      range: options.range
    })
  })

program
  .command('drop')
  .description('drop the table')
  .option('-d, --debug', 'output extra debugging', false)
  .option('-n, --name <name>', 'table name', 'darkphoton')
  .action(async (options) => {
    dropTable({
      debug: options.debug,
      name: options.name
    })
  })

program.parse()
