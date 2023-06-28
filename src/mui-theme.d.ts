import { themeStyled } from '@/theme';

type CustomTheme = {
  [Key in keyof typeof themeStyled]: (typeof themeStyled)[Key];
};

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends CustomTheme {}
}
