import { Table } from '../../data/Model.js'
/*
  configure the table here.
*/
export const Params = ({
  name = 'darkphoton',
  hash = '_pk',
  range = '_sk'
}) => {
  return Table({
    name,
    hash,
    range
  })
}
