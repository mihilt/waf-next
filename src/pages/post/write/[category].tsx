import { Box } from '@mui/material';
import Router, { useRouter } from 'next/router';
import Page from '../../../components/page';
import Layout from '../../../layout';

interface Props {}

export default function Writing({}: Props): JSX.Element {
  const router = useRouter();
  const { category } = router.query;
  return (
    <Page>
      <Layout>
        <main>
          <Box>{category}</Box>
        </main>
      </Layout>
    </Page>
  );
}
