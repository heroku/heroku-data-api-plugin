# heroku-data-api-plugin

A Heroku plugin to communicate with the undocumented, internal, unstable
data APIs. We hope to bring you a real API one day.

### Usage

**GET Request**
```
heroku data-api GET /client/v11/databases/postgresql-triangular-89732
```

**POST Request**
```
echo "{\"name\": \"readonly\"}" | heroku data-api POST /postgres/v0/databases/postgresql-triangular-89732/credentials
```

**POST Request with Basic Auth**
To mimic interactions between the addons API and Shogun
```
echo "{\"name\": \"credential:test-user\"}" | heroku data-api POST /addons/heroku-postgresql-cpurcell/heroku/resources/959ce918-0c36-4a2c-915b-1a54910178df/namespaces --username heroku-postgresql-cpurcell --password <redacted>
```

**Dev Environments**

A custom host (instead of `postgres-api.heroku.com`) can be set with the
`HEROKU_DATA_HOST` environment variable, e.g.:

`HEROKU_DATA_HOST=postgres-api.example.com heroku data-api GET /client/v11/databases/postgresql-awesome-12345`

### Installation

```shell
yarn config set ignore-engines true -g
npm install --legacy-peer-deps
heroku plugins:link .
yarn config set ignore-engines false -g
```


#### Update

```bash
$ git pull origin main
```

## THIS IS BETA SOFTWARE

Thanks for trying it out. If you find any problems, please report an
issue and include your Heroku toolbelt version and your OS version.
