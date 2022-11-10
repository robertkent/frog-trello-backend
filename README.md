# Frog Trello Backend

### Pre-requisites:

Create an .env file locally and enter the following:

- MONGO_USER=
- MONGO_PASSWORD=
- MONGO_CLUSTER=
- MONGO_DEFAULT_DATABASE=
- NODEJS_PORT=8080

### For testing:

Create a .env.test file and enter the test credentials

- MONGO_USER=
- MONGO_PASSWORD=
- MONGO_CLUSTER=
- MONGO_DEFAULT_DATABASE= (typically just a separate database)
- NODEJS_PORT=8080

### To install:

- clone the repo and `npm install`
- `npm start` should start the express server and connect to DB
- `npm test` should run the unit / integration tests

Note: One of the tests is designed to check the graphQL endpoint is available remotely - this will fail if the `npm start` isn't running in a separate terminal.

Tested with Node v16/17