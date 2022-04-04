import Query from './query';
import Mutation from './mutation';
import {GraphQLScalarType} from 'graphql';

const resolvers = {
    Query: Query.Query,
    Mutation: Mutation.Mutation,
    Date: new GraphQLScalarType<Date, string>({
        name: 'Date',
        parseValue(value) {
            return new Date(value as string);
        },
        serialize(value) {
            return (value as Date).toISOString();
        }
    })
};
export default resolvers;
