# darkphoton.io

## Abstract

> Company Website

### Boilerplate

`create-react-app` was used to generate the site boilerplate.

- The standard CRA generated docs are [here](./docs/CRA.md)

### Model

This site is backed by DynamoDB & leverages modern patterns for storing records and relations in a single table.

```js
{
    _pk: '_pk',
    _sk: '_sk',
    data: '{
        "foo": "bar"
    }'
}
```
