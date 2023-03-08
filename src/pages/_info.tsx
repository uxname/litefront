import React, { ReactNode } from 'react';

import appInfo from '../../app-info.json';

export default function _InfoPage(): ReactNode {
  return (
    <div>
      {`${appInfo.name} ${appInfo.version}`}
      <hr />
    </div>
  );
}
