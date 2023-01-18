import React, {ReactNode} from 'react';
import {GetServerSideProps} from 'next';
import Image from 'next/image';

import Cat from '../../public/assets/cat.jpg?trace';
import {Meta} from '../components/meta';
import {AllFilmsDocument, AllFilmsQuery, AllFilmsQueryVariables, useAllFilmsQuery} from '../generated/graphql';
import {IIndexPageProps} from '../interfaces/index-page';
import {getApolloClient} from '../utils/ApolloClient';

export default function IndexPage({data: ssrData, imageUrl}: IIndexPageProps): ReactNode {
    const {data, loading, error} = useAllFilmsQuery({variables: {take: 1}});

    async function throwTestError() {
        console.log('Throwing test error');
        throw new Error('Test error');
    }

    return (
        <div>
            <Meta image={imageUrl}/>
            <Image alt={'logo'} height={100} width={250} src={imageUrl} loader={() => imageUrl} priority unoptimized/>
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
            <pre>{JSON.stringify(ssrData?.allFilms, null, 2)}</pre>
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
    const port = process.env.NODE_ENV === 'production' ? '7171' : '3000';
    const ogImage = `//localhost:${port}/api/logo?titleFirst=OG_&titleSecond=image`;
    const echoRes = await getApolloClient.query<AllFilmsQuery, AllFilmsQueryVariables>({
        query: AllFilmsDocument,
        variables: {
            take: 2
        }
    });

    const result: IIndexPageProps = {
        data: echoRes.data,
        imageUrl: ogImage
    };
    return {
        props: result
    };
};

