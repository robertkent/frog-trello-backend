const { buildSchema } = require("graphql");

module.exports = buildSchema(`

    type RootMutation {
        test: Boolean
    }

    type RootQuery {
        test: Boolean
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
    
`);
