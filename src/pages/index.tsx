import React, { ReactNode } from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { ApolloError } from '@apollo/client';
import { Meta } from '@components/meta';
import { Button } from '@components/ui/button';

import {
  AllFilmsDocument,
  AllFilmsQuery,
  AllFilmsQueryVariables,
  useAllFilmsQuery,
} from '@/generated/graphql';
import { IIndexPageProperties } from '@/interfaces/index-page';
import { getApolloClient } from '@/utils/apollo-client';

import Cat from '../../public/assets/cat.jpg?trace';

function renderClientQueryComponent(
  error: ApolloError | undefined,
  loading: boolean,
  data: AllFilmsQuery | undefined,
) {
  if (error) {
    return <div>Error</div>;
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h3>Client side query:</h3>
      {/* eslint-disable-next-line no-magic-numbers */}
      <pre>{JSON.stringify(data, undefined, 2)}</pre>
    </div>
  );
}

export default function IndexPage({
  data: ssrData,
  imageUrl,
}: IIndexPageProperties): ReactNode {
  const { data, loading, error } = useAllFilmsQuery({ variables: { take: 1 } });

  async function throwTestError() {
    console.log('Throwing test error');
    throw new Error('Test error');
  }

  return (
    <div>
      <Meta image={imageUrl} />
      <Image
        alt={'logo'}
        height={100}
        width={250}
        src={imageUrl}
        loader={() => imageUrl}
        priority
        unoptimized
      />
      <br />
      <Button
        onClick={async () => {
          await throwTestError();
        }}
      >
        Throw error
      </Button>
      <h1>
        API URL:
        <a href={process.env.NEXT_PUBLIC_GRAPHQL_API_URL}>
          {process.env.NEXT_PUBLIC_GRAPHQL_API_URL}
        </a>
      </h1>
      <h3>SSR Request: </h3>
      <br />
      {/* eslint-disable-next-line no-magic-numbers */}
      <pre>{JSON.stringify(ssrData?.allFilms, undefined, 2)}</pre>
      <hr />
      <br />
      {renderClientQueryComponent(error, loading, data)}
      <Image alt={'cat'} src={Cat} width={450} height={300} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const port = process.env.NODE_ENV === 'production' ? '7171' : '3000';
  const ogImage = `//localhost:${port}/api/logo?titleFirst=OG_&titleSecond=image`;
  const echoResult = await getApolloClient.query<
    AllFilmsQuery,
    AllFilmsQueryVariables
  >({
    query: AllFilmsDocument,
    variables: {
      take: 2,
    },
  });

  const result: IIndexPageProperties = {
    data: echoResult.data,
    imageUrl: ogImage,
  };
  return {
    props: result,
  };
};
