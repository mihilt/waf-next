import Head from 'next/head';
import { Inter } from 'next/font/google';
import Layout from '../layout';
import { Box } from '@mui/material';
import Page from '../components/page';

export default function Home() {
  return (
    <Page>
      <Layout>
        <main>
          <Box>main page</Box>
        </main>
      </Layout>
    </Page>
  );
}
