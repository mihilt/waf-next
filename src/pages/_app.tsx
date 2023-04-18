import '@/styles/globals.css';
import { ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../components/loader';
import theme from '../lib/mui-theme';

// TODO: add GA
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    router.events.on('routeChangeStart', url => {
      setIsLoading(true);
    });

    router.events.on('routeChangeComplete', url => {
      setIsLoading(false);
    });

    router.events.on('routeChangeError', url => {
      setIsLoading(false);
    });
  }, [router.events]);

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
      {isLoading && <Loader />}
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
