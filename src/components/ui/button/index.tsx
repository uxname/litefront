import React, { PropsWithChildren, ReactElement } from 'react';
import { Button } from '@mui/material';
import styled from 'styled-components';

const ButtonBase = styled(Button)`
  margin: 0 0 0 10px;
  padding: ${(properties) => properties.theme.buttonsPaddings}px
    ${(properties) => properties.theme.buttonsPaddings}px;
`;

export function MyButton({
  children,
  onClick,
}: PropsWithChildren<{
  onClick?: () => void;
}>): ReactElement {
  return (
    <ButtonBase variant={'contained'} onClick={onClick}>
      {children}
    </ButtonBase>
  );
}
