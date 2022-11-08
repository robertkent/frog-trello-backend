const { buildSchema } = require("graphql");

export default buildSchema(`

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
