import {ApolloServer} from 'apollo-server-micro';
import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core';
import {MicroRequest} from 'apollo-server-micro/dist/types';
import {ServerResponse} from 'http';
import {loadTypeDefs} from './schema';
import resolvers from './resolvers';

const apolloServer = new ApolloServer({
    typeDefs: loadTypeDefs(),
    resolvers,
    mocks: false,
    mockEntireSchema: false,
    // eslint-disable-next-line new-cap
    plugins: process.env.NODE_ENV !== 'production' ? [ApolloServerPluginLandingPageGraphQLPlayground()] : []
});

const startServer = apolloServer.start();

export default async function handler(req: MicroRequest, res: ServerResponse) {
    await startServer;
    await apolloServer.createHandler({
        path: '/api/graphql'
    })(req, res);
}

export const config = {
    api: {
        bodyParser: false
    }
};
