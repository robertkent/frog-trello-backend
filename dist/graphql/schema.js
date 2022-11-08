"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { buildSchema } = require("graphql");
exports.default = buildSchema(`

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
