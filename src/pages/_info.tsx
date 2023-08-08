// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-magic-numbers */
import React, { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';

import { getBrowserId } from '@/services/log';

import appInfo from '../../app-info.json';

export default function InfoPage(properties: { uptime: number }): ReactNode {
  const formatDate = (date: number): string => {
    const seconds = Math.floor(date % 60);
    const minutes = Math.floor((date / 60) % 60);
    const hours = Math.floor((date / (60 * 60)) % 24);
    const days = Math.floor(date / (60 * 60 * 24));

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const [browserId, setBrowserId] = useState<string | undefined>();

  useEffect(() => {
    setBrowserId(getBrowserId());
  }, []);

  return (
    <Page>
      <InfoItem>Browser ID:</InfoItem>
      <Header>{browserId}</Header>
      <hr />
      <InfoItem>{`${appInfo.name} (v ${appInfo.version})`}</InfoItem>
      <InfoItem>Uptime: {formatDate(properties.uptime)}</InfoItem>
    </Page>
  );
}

const Page = styled.div`
  background-color: white;
  color: black;
  padding-left: 16px;
  padding-right: 16px;
`;

const Header = styled.div`
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 0;
`;

const InfoItem = styled.p`
  margin-top: 0;
  margin-bottom: 0;
  color: #888888;
`;

export async function getServerSideProps() {
  const uptime = process.uptime();
  return { props: { uptime } };
}
