import StarsIcon from '@mui/icons-material/Stars';
import { Box, Grid } from '@mui/material';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import { getCategoriesApi } from '../apis';
import Page from '../components/page';
import Layout from '../layout';
import { Category } from '../types';
import { isRecommendedPost } from '../utils';

export default function Home(props: any) {
  const categories = props.categories;
  return (
    <Page>
      <Layout>
        <main>
          <Box>
            <Grid container>
              {categories.map((category: Category) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={category.categoryId} sx={{ p: 1 }}>
                  <Box
                    sx={{
                      cursor: 'pointer',
                      color: '#000999',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                    }}
                    onClick={() => {
                      Router.push(`/posts/${category.categoryId}`);
                    }}
                  >
                    {category.name}
                  </Box>
                  <Box>
                    {category.recentPosts?.map(post => {
                      return (
                        <Box
                          key={post.categorySeq}
                          sx={{
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            Router.push(`/post/${category.categoryId}/${post.categorySeq}`);
                          }}
                        >
                          {isRecommendedPost(post.like) && (
                            <StarsIcon
                              sx={{
                                color: 'red',
                                fontSize: '0.8rem',
                                verticalAlign: 'middle',
                              }}
                            />
                          )}{' '}
                          {post.title}{' '}
                          <span
                            style={{
                              color: '#000999',
                              fontSize: '0.6rem',
                              fontWeight: 700,
                              marginLeft: '0.1rem',
                            }}
                          >
                            [{post.commentCount}]
                          </span>
                        </Box>
                      );
                    })}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </main>
      </Layout>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  let res;
  try {
    res = await getCategoriesApi({ isGetRecentPosts: true });
  } catch (e) {
    return {
      notFound: true,
    };
  }
  return {
    props: res.data,
  };
};
