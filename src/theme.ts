import { createTheme } from '@mui/material';
import { Theme } from '@mui/material/styles/createTheme';

import { ITheme } from '@/interfaces/i-theme';

export const themeMui: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ff9e80',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

export const themeStyled: ITheme = {
  buttonsPaddings: 10,
};
