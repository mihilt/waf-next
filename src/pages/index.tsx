import StarsIcon from '@mui/icons-material/Stars';
import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getCategoriesApi } from '../apis';
import Page from '../components/page';
import Layout from '../layout';
import { Categories, Category } from '../types';
import { isRecommendedPost, isSameDate, stringEllipsis } from '../utils';

interface Props {
  categories: Categories;
}

export default function Home({ categories }: Props): JSX.Element {
  const router = useRouter();
  const theme = useTheme();
  const isSmallerThanSm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Page>
      <Layout>
        <main>
          <Box>
            <Grid container rowSpacing={isSmallerThanSm ? 3 : 6} columnSpacing={4}>
              {categories.map((category: Category) => (
                <Grid item xs={12} sm={6} md={6} lg={4} key={category.categoryId}>
                  <Box
                    sx={{
                      cursor: 'pointer',
                      color: '#000999',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      p: 1,
                      borderBottom: '1px solid #e0e0e0',
                    }}
                    onClick={() => {
                      router.push(`/posts/${category.categoryId}`);
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
                            '&:hover': {
                              backgroundColor: '#f5f5f5',
                            },
                            borderBottom: '1px solid #e0e0e0',
                            fontSize: '0.8rem',
                            px: 1,
                            py: 0.5,
                          }}
                          onClick={() => {
                            router.push(`/post/${category.categoryId}/${post.categorySeq}`);
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box>
                              {isRecommendedPost(post.like) && (
                                <StarsIcon
                                  sx={{
                                    color: 'red',
                                    fontSize: '0.8rem',
                                    verticalAlign: 'middle',
                                  }}
                                />
                              )}{' '}
                              {stringEllipsis(post.title, 20)}{' '}
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
                            <Box>
                              <span style={{ fontSize: '0.7rem' }}>
                                {isSameDate(new Date(post.createdAt), new Date())
                                  ? moment(post.createdAt).format('HH:mm')
                                  : moment(post.createdAt).format('YYYY-MM-DD')}
                              </span>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 1 }} />
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
