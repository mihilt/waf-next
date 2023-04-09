import { Box, Divider, Grid, useMediaQuery, useTheme } from '@mui/material';

import moment from 'moment';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { getPostsApi } from '../../apis';
import Page from '../../components/page';
import Layout from '../../layout';
import { isSameDate } from '../../utils';

interface Props {
  count: number;
  // TODO: posts: Post[];
  posts: any;
}

export default function Category({ count, posts }: Props): JSX.Element {
  const router = useRouter();
  const theme = useTheme();

  const { category } = router.query;

  const isSmallerThanMd = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Page>
      <Layout>
        <main>
          <Box>category: {category}</Box>
          <Box>count: {count}</Box>
          <Divider />
          <Box>
            {posts.map(
              (
                //TODO: post: Post
                post: any,
              ) => (
                <Grid
                  container
                  key={post.postId}
                  sx={{
                    textAlign: 'center',
                    fontSize: '12px',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },

                    borderBottom: '1px solid #e0e0e0',
                  }}
                >
                  <Grid item md={0.5} hidden={isSmallerThanMd}>
                    {post.categoryId}
                  </Grid>
                  <Grid item xs={5.5} md={7} sx={{ textAlign: 'left', cursor: 'pointer' }}>
                    {post.title}
                    <span style={{ color: '#000999', fontSize: '10px', fontWeight: 700 }}>
                      [{post.commentCount}]
                    </span>
                  </Grid>
                  <Grid item xs={3.5} md={2} sx={{ textAlign: 'left' }}>
                    {post.author}({post.ip})
                  </Grid>
                  <Grid item xs={2} md={1.5}>
                    {isSameDate(new Date(post.createdAt), new Date())
                      ? moment(post.createdAt).format('HH:mm')
                      : moment(post.createdAt).format('YYYY-MM-DD')}
                  </Grid>
                  <Grid item xs={0.5} md={0.5}>
                    {post.view}
                  </Grid>
                  <Grid item xs={0.5} md={0.5}>
                    {post.like}
                  </Grid>
                </Grid>
              ),
            )}
          </Box>
        </main>
      </Layout>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context: GetServerSidePropsContext,
) => {
  const { category } = context.query;

  const res = await getPostsApi({ category: category as string });
  const { count, result: posts } = res.data;

  return {
    props: { count, posts },
  };
};
