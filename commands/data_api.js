'use strict'

const cli = require('heroku-cli-util')
const co = require('co')
const fs = require('co-fs')
const util = require('../lib/util.js')

module.exports = {
  topic: 'data-api',
  description: 'make a single request to the internal, undocumented data API',
  help: `The api command is a convenient but low-level way to send requests
to the internal, undocumented Heroku Data APIs for Heroku Postgres, Redis,
and Apache Kafka on Heroku. It sends an HTTP request to the API
using the given method on the given path. For methods PUT, PATCH,
and POST, it uses stdin unmodified as the request body. It prints
the response unmodified on stdout.

Method name input will be upcased, so both 'heroku api GET /apps' and
'heroku api get /apps' are valid commands.

If username and password are provided, they will be used for HTTP basic
authentication.

Example:

    $ heroku data-api GET /client/v11/databases/postgresql-triangular-89732
    {
      "addon_id": "476dfd5d-e289-4f4a-a281-c8f913c3efc6",
      "name": "postgresql-triangular-89732",
      …
    }

    $ heroku data-api GET /client/v11/databases/postgresql-triangular-89732 --username myuser --password mypass
`,
  needsApp: false,
  needsAuth: true,
  args: [
    { name: 'method', description: 'GET, POST, PUT, PATCH, or DELETE', optional: false },
    { name: 'path', description: 'endpoint to call', optional: false }
  ],
  flags: [
    { name: 'username', char: 'u', description: 'username for HTTP basic authentication', hasValue: true },
    { name: 'password', char: 'p', description: 'password for HTTP basic authentication', hasValue: true }
  ],
  run: cli.command({ preauth: true }, co.wrap(function * (context, heroku) {
    const request = {
      method: context.args.method.toUpperCase(),
      path: context.args.path,
      host: util.host()
    }
    
    // Add HTTP basic authentication if username and password are provided
    if (context.flags.username && context.flags.password) {
      const credentials = Buffer.from(`${context.flags.username}:${context.flags.password}`).toString('base64')
      request.headers = {
        'Authorization': `Basic ${credentials}`
      }
    }
    
    if (['PATCH', 'PUT', 'POST'].includes(request.method)) {
      const body = yield fs.readFile('/dev/stdin', 'utf8')
      let parsedBody
      try {
        parsedBody = JSON.parse(body)
      } catch (e) {
        throw new Error('Request body must be valid JSON')
      }
      request.body = parsedBody
    }
    const response = yield heroku.request(request)

    if (typeof response === 'object') {
      cli.styledJSON(response)
    } else {
      cli.log(response)
    }
  }))
}
