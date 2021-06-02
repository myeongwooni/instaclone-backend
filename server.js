require("dotenv").config();
import express from "express";
import logger from "morgan";
import {ApolloServer} from "apollo-server-express";
import { typeDefs, resolvers } from "./schema.js";
import { getUser } from "./users/users.utils.js";

const server = new ApolloServer({
    resolvers,
    typeDefs,
    context: async ({req}) => {
        return {
            loggedInUser: await getUser(req.headers.token),
        };
    },
});

const app = express();
app.use(logger("tiny"));
server.applyMiddleware({app});
const PORT = process.env.PORT
app.listen({port:PORT}, () => {
        console.log(`💕 Server is running on http://localhost:${PORT} ❕`);
});