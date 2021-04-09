import React from 'react';
import {getApolloClient} from '../utils/ApolloClient';
import {ApolloProvider} from '@apollo/client';
import {GetServerSideProps} from 'next';
import {AllPlanetsDocument, AllPlanetsQuery, AllPlanetsQueryResult, useAllFilmsQuery} from '../generated/graphql';

const EchoPage = (props: AllPlanetsQueryResult) => {
    return (
        <ApolloProvider client={getApolloClient}>
            <div>
                <h1>API URL: <a
                    href={process.env.NEXT_PUBLIC_GRAPHQL_API_URL}>{process.env.NEXT_PUBLIC_GRAPHQL_API_URL}</a></h1>
                <h3>SSR Request: </h3>
                <br/>
                <span>{JSON.stringify(props.data?.allPlanets?.edges)}</span>
                <hr/>
                <br/>
                <DataBlock {...props}/>
            </div>
        </ApolloProvider>
    );
};

const DataBlock = (props) => {
    const {data, loading, error} = useAllFilmsQuery({variables: {first: 1}});
    return (
        <div>
            <h3>Client side query:</h3>
            {
                error ? <div>Error</div> : loading ? <div>Loading...</div> : JSON.stringify(data)
            }
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const echoRes = await getApolloClient.query<AllPlanetsQuery>({
        query: AllPlanetsDocument,
        variables: {
            first: 4
        }
    });
    return {
        props: echoRes
    };
};

export default EchoPage;
