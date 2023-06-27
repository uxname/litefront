import { createTheme } from '@mui/material';

export const themeMui = createTheme({
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

export const themeStyled = {
  buttonsPaddings: 10,
} as const;
