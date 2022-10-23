# darkphoton.io

## Abstract

> Company Website

### Boilerplate

`create-react-app` was used to generate the site boilerplate.

- The standard CRA generated docs are [here](./docs/CRA.md)

### Model

The DynamoDB data model is as defined as seen below.

```js
{
    _pk: '_pk',
    _sk: '_sk',
    data: '{
        "foo": "bar"
    }'
}
```

### Seed

You need to create the `data/Data.js` file before utiizing the data utility. This file is intentionlly excluded from `git` for security purposes.

The seed data should be defined as seen below.

```json
{
    "type": "object",
    "owners": [
        {
            "type": "object",
            "name": "string",
            "contacts": {

            },
            "bio": {
                "type": "object",
                "birth": {
                    "type": "object",
                    "ancestry": [
                        {
                            "type": "object",
                            "name": "",
                            "relation": ""
                        }
                    ],
                    "temporal": {
                        "type": "object"
                    },
                    "spatial": {
                        "type": "object"
                    }
                }
            }
        }
    ],
}
```
