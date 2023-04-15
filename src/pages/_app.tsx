import '@/styles/globals.css';
import { ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import theme from '../lib/mui-theme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// TODO: add GA
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        limit={4}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
