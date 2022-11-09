"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { buildSchema } = require("graphql");
exports.default = buildSchema(`

    type Card {
        _id: ID!
        title: String!
        description: String
        dueDate: String!
        board: ID!
    }

    type Board {
        _id: ID!
        title: String!
        cards: [Card]
    }
    
    type BoardData {
        boards: [Board]
    }

    input BoardInput {
        title: String!
    }

    input CardInput {
        title: String!
        description: String
        dueDate: String!
        board: ID!
    }
    
    input MoveCardInput {
        cardId: ID! 
        boardId: ID!
    }
    
    input ReorderCardsInput {
        cardIds: [ID!]!
        boardId: ID!
    }
    
    input DeleteCardInput {
        cardId: ID!
    }

    type RootMutation {
        test: Boolean
        createBoard(input: BoardInput): Board!
        createCard(input: CardInput): Card!
        moveCard(input: MoveCardInput): Card!
        reorderCards(input: ReorderCardsInput): Board!
        deleteCard(input: DeleteCardInput): Card!
        reset: BoardData
    }

    type RootQuery {
        test: Boolean
        getBoards: BoardData
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
    
`);
