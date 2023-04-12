import { Box } from '@mui/material';
import Router from 'next/router';
import Page from '../components/page';
import Layout from '../layout';

export default function Home() {
  return (
    <Page>
      <Layout>
        <main>
          <Box
            onClick={() => {
              Router.push('/posts/life');
            }}
          >
            life
          </Box>
        </main>
      </Layout>
    </Page>
  );
}
