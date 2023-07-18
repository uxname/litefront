import { createTheme } from '@mui/material';

export const themeMui = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2962FF',
    },
    secondary: {
      main: '#F42A8B',
    },
  },
});

export const themeStyled = {
  buttonsPaddings: 10,
} as const;
