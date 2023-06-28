import React, { ReactNode } from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { ApolloError } from '@apollo/client';
import { Meta } from '@components/meta';
import { MyButton } from '@components/ui/button';
import { Card } from '@mui/material';
import Cat from '@public/assets/cat.jpg';
import styled from 'styled-components';

import {
  AllFilmsDocument,
  AllFilmsQuery,
  AllFilmsQueryVariables,
  useAllFilmsQuery,
} from '@/generated/graphql';
import { IndexPagePropertiesType } from '@/interfaces/index-page';
import { useClickStore } from '@/store/click.store';
import { getApolloClient } from '@/utils/apollo-client';
import { log } from '@/utils/log';

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

function RenderState(): React.JSX.Element {
  const { count, increase, reset } = useClickStore();
  const MyCard = styled(Card)`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
  `;

  return (
    <div>
      <MyCard>
        <h3>Render state component:</h3>
        <div>Count: {count}</div>
        <MyButton onClick={increase}>Increase</MyButton>
        <MyButton onClick={reset}>Reset</MyButton>
      </MyCard>
    </div>
  );
}

export default function IndexPage({
  data: ssrData,
  imageUrl,
}: IndexPagePropertiesType): ReactNode {
  const { data, loading, error } = useAllFilmsQuery({ variables: { take: 1 } });

  async function throwTestError() {
    log.warn('Throwing test error');
    throw new Error('Test error');
  }

  log.trace('Hello world trace');
  log.debug('Hello world debug');
  log.info('Hello world info');
  log.warn('Hello world warn');
  log.error('Hello world error');

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
      <MyButton
        onClick={async () => {
          await throwTestError();
        }}
      >
        Themed button. Throw error
      </MyButton>

      <RenderState />
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

  const result: IndexPagePropertiesType = {
    data: echoResult.data,
    imageUrl: ogImage,
  };
  return {
    props: result,
  };
};
