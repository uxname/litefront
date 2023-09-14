// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-magic-numbers */
import { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';

import { getBrowserId } from '@/services/log';
import { useSettingsStore } from '@/store/settings.store';

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
  const { debugMode, setDebugMode } = useSettingsStore();

  useEffect(() => {
    setBrowserId(getBrowserId());
  }, []);

  const toggleDebugMode = (): void => {
    setDebugMode(!debugMode);
  };

  return (
    <Page>
      <InfoItem>Browser ID:</InfoItem>
      <Header>{browserId}</Header>
      <hr />
      <InfoItem>{`${appInfo.name} (v ${appInfo.version})`}</InfoItem>
      <InfoItem>Uptime: {formatDate(properties.uptime)}</InfoItem>
      <hr />
      <ToggleContainer>
        <ToggleLabel>Debug Mode:</ToggleLabel>
        <ToggleSwitch checked={debugMode} onChange={toggleDebugMode} />
      </ToggleContainer>
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

export async function getServerSideProps(): Promise<{
  props: { uptime: number };
}> {
  const uptime = process.uptime();
  return { props: { uptime } };
}

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const ToggleLabel = styled.p`
  margin: 0;
  margin-right: 8px;
  color: #888888;
`;

const ToggleSwitch = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  width: 40px;
  height: 20px;
  background-color: #ccc;
  border-radius: 10px;
  position: relative;
  outline: none;
  cursor: pointer;

  &:checked {
    background-color: #3cba54;
  }

  &:before {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: white;
    top: 2px;
    left: 2px;
    transition: 0.3s;
    transform: translateX(0);
  }

  &:checked:before {
    transform: translateX(20px);
  }
`;
