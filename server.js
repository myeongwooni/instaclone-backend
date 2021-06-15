require("dotenv").config();
import express from "express";
import logger from "morgan";
import {ApolloServer} from "apollo-server-express";
import { typeDefs, resolvers } from "./schema.js";
import { getUser } from "./users/users.utils.js";
import { graphqlUploadExpress } from 'graphql-upload';

const PORT = process.env.PORT

const apollo = new ApolloServer({
    resolvers,
    typeDefs,
    uploads: false,
    context: async ({req}) => {
        return {
            loggedInUser: await getUser(req.headers.token),
        };
    },
});

const app = express();
app.use(graphqlUploadExpress());
app.use(logger("tiny"));
app.use("/static", express.static("uploads"));
apollo.applyMiddleware({app});
app.listen({port:PORT}, () => {
        console.log(`💕 Server is running on http://localhost:${PORT} ❕`);
});