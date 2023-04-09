import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { getPostsApi } from '../../apis';
import Page from '../../components/page';
import Layout from '../../layout';

interface Props {
  count: number;
  // TODO: posts: Post[];
  posts: any;
}

export default function Category({ count, posts }: Props): JSX.Element {
  const router = useRouter();
  const { category } = router.query;

  return (
    <Page>
      <Layout>
        <main>
          <Box>category: {category}</Box>
          <Box>count: {count}</Box>
          <Box>
            {posts.map(
              (
                //TODO: post: Post
                post: any,
              ) => (
                <Box key={post.postId}>
                  <Box>title: {post.title}</Box>
                  <Box>view: {post.view}</Box>
                  <Box>like: {post.like}</Box>
                </Box>
              ),
            )}
          </Box>
        </main>
      </Layout>
    </Page>
  );
}

export async function getServerSideProps() {
  const res = await getPostsApi({});
  const { count, result: posts } = res.data;

  return {
    props: { count, posts },
  };
}
