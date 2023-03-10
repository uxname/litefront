import React from 'react';
import Image from 'next/image';
import BgImg from '@public/assets/404bg.svg';
import styled from 'styled-components';

const Page = styled.div`
  height: 100%;
  width: 100%;
`;

const Content = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
`;

export default function Page404() {
  return (
    <Page>
      <Image src={BgImg} alt="404" fill />
      <Content>
        <h1>404 not found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
      </Content>
    </Page>
  );
}
