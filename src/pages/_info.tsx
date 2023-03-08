/* eslint-disable no-magic-numbers */
import React, { ReactNode } from 'react';

import appInfo from '../../app-info.json';

export default function InfoPage(props: { uptime: number }): ReactNode {
  const formatDate = (date: number): string => {
    const seconds = Math.floor(date % 60);
    const minutes = Math.floor((date / 60) % 60);
    const hours = Math.floor((date / (60 * 60)) % 24);
    const days = Math.floor(date / (60 * 60 * 24));

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div>
      {`${appInfo.name} ${appInfo.version}`}
      <hr />
      <p>Uptime: {formatDate(props.uptime)}</p>
    </div>
  );
}

export async function getServerSideProps() {
  const uptime = process.uptime();
  return { props: { uptime } };
}
