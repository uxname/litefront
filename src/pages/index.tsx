import React, {ReactNode} from 'react';
import {GetServerSideProps} from 'next';
import Image from 'next/image';

import Cat from '../../public/assets/cat.jpg?trace';
import {Meta} from '../components/Meta';
import {AllFilmsDocument, AllFilmsQuery, AllFilmsQueryVariables, useAllFilmsQuery} from '../generated/graphql';
import {IIndexPage} from '../interfaces/IndexPage';
import {getApolloClient} from '../utils/ApolloClient';

export default function IndexPage({data: allFilmsData, image}: IIndexPage): ReactNode {
    const {data, loading, error} = useAllFilmsQuery({variables: {take: 1}});

    async function throwTestError() {
        console.log('Throwing test error');
        throw new Error('Test error');
    }

    return (
        <div>
            <Meta image={image}/>
            <Image alt={'logo'} height={100} width={250} src={image} loader={() => image} priority unoptimized/>
            <br/>
            <button
                type="button"
                onClick={async () => {
                    await throwTestError();
                }}
            >
                Throw error
            </button>
            <h1>API URL:
                <a href={process.env.NEXT_PUBLIC_GRAPHQL_API_URL}>{process.env.NEXT_PUBLIC_GRAPHQL_API_URL}</a>
            </h1>
            <h3>SSR Request: </h3>
            <br/>
            {/* eslint-disable-next-line no-magic-numbers */}
            <pre>{JSON.stringify(allFilmsData.data?.allFilms, null, 2)}</pre>
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
            <Image alt={'cat'} src={Cat} width={450} height={300}/>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async () => {
    const ogImage = 'http://localhost:3000/api/logo?titleFirst=Lite&titleSecond=Front';
    const echoRes = await getApolloClient.query<AllFilmsQuery, AllFilmsQueryVariables>({
        query: AllFilmsDocument,
        variables: {
            take: 2
        }
    });
    return {
        props: {
            data: echoRes,
            image: ogImage
        }
    };
};

