import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import StarsIcon from '@mui/icons-material/Stars';
import CreateIcon from '@mui/icons-material/Create';
import SearchIcon from '@mui/icons-material/Search';
import moment from 'moment';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import qs from 'qs';
import { useEffect, useRef, useState } from 'react';
import { getPostsApi } from '../../apis';
import CategoryHeader from '../../components/categoryHeader';
import Page from '../../components/page';
import Layout from '../../layout';
import { Posts } from '../../types';
import { isRecommendedPost, isSameDate } from '../../utils';
interface Props {
  count: number;
  posts: Posts;
}

// TODO: url에 '+' 문자 있는 기본값 replace로 떼운거 다른 문자열로 변경하고 백엔드도 변경, 왜 new URL 내부에서 + 문자가 %2B로 바뀌는지 확인 필요, 기존에 +로 그냥 넣었을 때는 백엔드에서 공백 문자로 받았음.
export default function Category({ count, posts }: Props): JSX.Element {
  const isFirstRender = useRef(true);

  const router = useRouter();
  const theme = useTheme();

  const { category, page } = router.query;

  const [searchType, setSearchType] = useState('title+contents');
  const [searchValue, setSearchValue] = useState('');
  const [isSearchRecommended, setIsSearchRecommended] = useState(false);

  const isSmallerThanSm = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // TODO: Router.push 함수의 설정을 통해서도 기존 state 초기화가 가능할 것 같은데 확인해보기

    const {
      'search-type': searchType,
      'search-value': searchValue,
      'search-recommended': searchRecommended,
    } = router.query;
    setSearchType(
      searchType === undefined ? 'title+contents' : String(searchType)?.replace(' ', '+'),
    );
    setSearchValue(searchValue === undefined ? '' : String(searchValue));

    setIsSearchRecommended(searchRecommended === undefined ? false : true);
  }, [router.query]);

  useEffect(() => {
    if (isFirstRender.current) {
      // first render
      isFirstRender.current = false;
    } else {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearchRecommended]);

  const handleSearch = () => {
    let url = new URL(window.location.href);

    const search: any = {};

    if (searchType && searchValue) {
      search['search-type'] = searchType;
      search['search-value'] = searchValue;
    }

    if (isSearchRecommended) {
      search['search-recommended'] = true;
    }

    url.search = qs.stringify(search);

    router.push(url.href.replace('%2B', '+'));
  };

  return (
    <Page>
      <Layout>
        <main>
          <CategoryHeader category={category as string} />
          {isSmallerThanSm ? (
            posts.map(post => (
              <Box
                key={post.postId}
                sx={{
                  textAlign: 'center',
                  fontSize: '0.65rem',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                  borderBottom: '1px solid #e0e0e0',
                  p: 0.75,
                  cursor: 'pointer',
                }}
                onClick={() => {
                  router.push(`/post/${category}/${post.categoryId}`);
                }}
              >
                <Box sx={{ textAlign: 'left', fontSize: '0.9rem' }}>
                  {isRecommendedPost(post.like) && (
                    <StarsIcon
                      sx={{
                        color: 'red',
                        fontSize: '0.8rem',
                        verticalAlign: 'middle',
                      }}
                    />
                  )}{' '}
                  {post.title}
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
                <Box sx={{ mt: 0.25 }} />
                <Box sx={{ textAlign: 'left' }}>
                  {post.author}({post.ip}) |{' '}
                  {isSameDate(new Date(post.createdAt), new Date())
                    ? moment(post.createdAt).format('HH:mm')
                    : moment(post.createdAt).format('YYYY-MM-DD')}{' '}
                  | 조회: {post.view} | 추천:{' '}
                  {isRecommendedPost(post.like) ? (
                    <span style={{ color: '#000999', fontWeight: 600 }}>{post.like}</span>
                  ) : (
                    post.like
                  )}
                </Box>
              </Box>
            ))
          ) : (
            <>
              <Grid
                container
                sx={{
                  p: 0.75,
                  fontSize: '0.825rem',
                  borderBottom: '1px solid #e0e0e0',
                  backgroundColor: '#f5f5f5',
                }}
              >
                <Grid item xs={0.75} sx={{ textAlign: 'center' }}>
                  번호
                </Grid>
                <Grid item xs={6}>
                  제목
                </Grid>
                <Grid item xs={2}>
                  작성자
                </Grid>
                <Grid item xs={1.75} sx={{ textAlign: 'center' }}>
                  작성일
                </Grid>
                <Grid item xs={0.75} sx={{ textAlign: 'center' }}>
                  조회
                </Grid>
                <Grid item xs={0.75} sx={{ textAlign: 'center' }}>
                  추천
                </Grid>
              </Grid>
              {posts.map((post: any) => (
                <Grid
                  container
                  key={post.postId}
                  sx={{
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                    borderBottom: '1px solid #e0e0e0',
                    p: 1,
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    router.push(`/post/${category}/${post.categoryId}`);
                  }}
                >
                  <Grid item xs={0.75}>
                    {post.categoryId}
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'left' }}>
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
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: 'left' }}>
                    {post.author}({post.ip})
                  </Grid>
                  <Grid item xs={1.75}>
                    {isSameDate(new Date(post.createdAt), new Date())
                      ? moment(post.createdAt).format('HH:mm')
                      : moment(post.createdAt).format('YYYY-MM-DD')}
                  </Grid>
                  <Grid item xs={0.75}>
                    {post.view}
                  </Grid>
                  <Grid item xs={0.75}>
                    {isRecommendedPost(post.like) ? (
                      <span style={{ color: '#000999', fontWeight: 600 }}>{post.like}</span>
                    ) : (
                      post.like
                    )}
                  </Grid>
                </Grid>
              ))}
            </>
          )}
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', m: isSmallerThanSm ? 1.5 : 2 }}
          >
            <Box sx={{ fontSize: '0.725rem' }}>총: {count.toLocaleString()}개</Box>
            <Box sx={{ display: 'flex' }}>
              <Button
                variant="contained"
                startIcon={<StarsIcon />}
                onClick={() => {
                  setIsSearchRecommended(e => !e);
                }}
                color={isSearchRecommended ? 'primary' : 'gray'}
              >
                추천글
              </Button>
              <Box sx={{ ml: 1 }} />
              <Button
                variant="contained"
                startIcon={<CreateIcon />}
                onClick={() => {
                  router.push(`/post/write?category=${category}`);
                }}
              >
                글쓰기
              </Button>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Pagination
              count={(count / 20) % 1 === 0 ? count / 20 : Math.floor(count / 20) + 1}
              page={page ? Number(page) : 1}
              onChange={(e, value) => {
                const currentPath = window.location.pathname;
                const currentQuery = window.location.search;
                const currentQueryObject = qs.parse(currentQuery, {
                  ignoreQueryPrefix: true,
                });
                const nextQueryObject = {
                  ...currentQueryObject,
                  page: value,
                };
                const nextQuery = qs.stringify(nextQueryObject, {
                  addQueryPrefix: true,
                  encode: false,
                });
                router.push(`${currentPath}${nextQuery}`);
              }}
            />
          </Box>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box sx={{ width: 100 }}>
              <FormControl variant="standard" fullWidth>
                <InputLabel>검색 조건</InputLabel>
                <Select
                  value={searchType}
                  onChange={e => {
                    setSearchType(e.target.value as string);
                  }}
                >
                  <MenuItem value={'title+contents'}>제목+본문</MenuItem>
                  <MenuItem value={'title'}>제목</MenuItem>
                  <MenuItem value={'contents'}>본문</MenuItem>
                  <MenuItem value={'author'}>작성자</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ ml: 1 }} />
            <FormControl sx={{ width: 185 }} variant="standard">
              <InputLabel />
              <Input
                value={searchValue}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault(); // prevent form submission on Enter key press
                    handleSearch();
                  }
                }}
                onChange={e => {
                  setSearchValue(e.target.value);
                }}
                placeholder="검색어를 입력하세요."
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={e => {
                        /* if (!searchValue) {
                          toast.error('검색어를 입력하세요');
                          return;
                        } */
                        handleSearch();
                      }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>
          <Box sx={{ p: 2 }} />
        </main>
      </Layout>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context: GetServerSidePropsContext,
) => {
  const {
    category,
    'search-type': searchType,
    'search-value': searchValue,
    page,
    'search-recommended': searchRecommended,
  } = context.query;

  const param = {
    category: category as string,
    page: page as string,
    ...(searchType &&
      searchValue && { searchType: searchType as string, searchValue: searchValue as string }),
    ...(searchRecommended && { like: process.env.RECOMMENDED_POST_LIKE as string }),
  };

  const res = await getPostsApi(param);
  const { count, result: posts } = res.data;

  return {
    props: { count, posts },
  };
};
