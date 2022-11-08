import express from "express";
import { cors } from "./util/cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { graphqlHTTP } from "express-graphql";
import graphQlSchema from "./graphql/schema";
import graphQlResolvers from "./graphql/resolvers";

dotenv.config();

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.zgbwrji.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?w=majority`;
const app = express();

app.use(bodyParser.json());
app.use(cors);

// set up graphQL endpoint

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  })
);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));