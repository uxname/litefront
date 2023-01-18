import React, {ReactElement, ReactNode} from 'react';
import styled from 'styled-components';

const ButtonBase = styled.button`
  background: #fff;
  border: 1px solid #000;
  border-radius: 4px;
  box-shadow: #bebebe 0 0 10px 4px;
  margin: 0 0 0 10px;
  padding: 10px 20px;

  :hover {
    background: #bebebe;
  }
`;

export function Button({children, onClick}: {children: ReactNode; onClick?: () => void}): ReactElement {
    return (
        <ButtonBase onClick={onClick}>
            {children}
        </ButtonBase>
    );
}
