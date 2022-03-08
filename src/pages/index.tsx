import React, {ReactNode} from 'react';
import {getApolloClient} from '../utils/ApolloClient';
import {GetServerSideProps} from 'next';
import {AllPlanetsDocument, AllPlanetsQuery, AllPlanetsQueryResult, useAllFilmsQuery, AllPlanetsQueryVariables} from '../generated/graphql';
import Logo from '../../public/assets/logo.svg';
import Cat from '../../public/assets/cat.jpg?trace';
import Image from 'next/image';

export default function IndexPage(props: AllPlanetsQueryResult): ReactNode {
    const {data, loading, error} = useAllFilmsQuery({variables: {first: 1}});
    return (
        <div>
            <Image height={100} width={250} src={Logo}/>
            <h1>API URL:
                <a href={process.env.NEXT_PUBLIC_GRAPHQL_API_URL}>{process.env.NEXT_PUBLIC_GRAPHQL_API_URL}</a>
            </h1>
            <h3>SSR Request: </h3>
            <br/>
            {/* eslint-disable-next-line no-magic-numbers */}
            <pre>{JSON.stringify(props.data?.allPlanets?.edges, null, 2)}</pre>
            <hr/>
            <br/>
            <div>
                <h3>Client side query:</h3>
                {
                    error ? <div>Error</div> : loading ? <div>Loading...</div>
                        // eslint-disable-next-line no-magic-numbers
                        : <pre>{JSON.stringify(data, null, 2)}</pre>
                }
            </div>
            <Image src={Cat} width={450} height={300}/>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async () => {
    const echoRes = await getApolloClient.query<AllPlanetsQuery, AllPlanetsQueryVariables>({
        query: AllPlanetsDocument,
        variables: {
            first: 4
        }
    });
    return {
        props: echoRes
    };
};
