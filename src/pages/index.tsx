import React, { ReactNode } from 'react';
import Image from 'next/image';
import { MyButton } from '@components/ui/button';
import { Card } from '@mui/material';
import Cat from '@public/assets/cat.jpg';
import styled from 'styled-components';

import { log } from '@/services/log';
import { useClickStore } from '@/store/click.store';

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

export default function IndexPage(): ReactNode {
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
      <hr />
      <br />
      <Image alt={'cat'} src={Cat} width={450} height={300} />
      <Image
        src={'/api/logo?titleFirst=OG_&titleSecond=image'}
        alt={'logo'}
        loader={() => '/api/logo?titleFirst=OG_&titleSecond=image'}
        width={250}
        height={100}
      />
    </div>
  );
}
