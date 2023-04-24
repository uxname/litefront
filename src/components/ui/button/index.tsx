import React, { ReactElement, ReactNode } from 'react';
import { Button } from '@mui/material';
import styled from 'styled-components';

import { IThemeRoot } from '@/interfaces/i-theme';

const ButtonBase = styled(Button)`
  margin: 0 0 0 10px;
  padding: ${(properties: IThemeRoot) => properties.theme.buttonsPaddings}px
    ${(properties: IThemeRoot) => properties.theme.buttonsPaddings}px;
`;

export function MyButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}): ReactElement {
  return (
    <ButtonBase variant={'contained'} onClick={onClick}>
      {children}
    </ButtonBase>
  );
}
