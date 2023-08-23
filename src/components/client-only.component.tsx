import React from 'react';
import { ReactNode, useEffect, useState } from 'react';

interface ClientOnlyProperties {
  children: ReactNode;
}

export const ClientOnly: React.FC<ClientOnlyProperties> = ({ children }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // eslint-disable-next-line unicorn/no-null
    return null;
  }

  return children;
};

export default ClientOnly;
