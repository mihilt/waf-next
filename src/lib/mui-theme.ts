import { createTheme } from '@mui/material/styles';
export default createTheme({
  typography: {
    fontFamily: ['Spoqa Han Sans Neo', 'sans-serif'].join(','),
  },
  palette: {
    white: {
      light: '#FFFFFF',
      main: '#FFFFFF',
      dark: '#EEEEEE',
      contrastText: '#000000',
    },
    primary: {
      light: '#000999',
      main: '#000999',
      dark: '#000777',
      contrastText: '#FFFFFF',
    },
    gray: {
      light: '#aaa',
      main: '#aaa',
      dark: '#999',
      contrastText: '#FFFFFF',
    },
  },
});
declare module '@mui/material/styles' {
  interface Palette {
    white: Palette['primary'];
    gray: Palette['primary'];
  }
  interface PaletteOptions {
    white: PaletteOptions['primary'];
    gray: PaletteOptions['primary'];
  }
}
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    white: true;
    gray: true;
  }
}
declare module '@mui/material/TextField' {
  interface TextFieldPropsColorOverrides {
    white: true;
    gray: true;
  }
}
