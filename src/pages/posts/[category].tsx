import {
  Box,
  Button,
  Divider,
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

import CreateIcon from '@mui/icons-material/Create';
import SearchIcon from '@mui/icons-material/Search';
import moment from 'moment';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Router, { useRouter } from 'next/router';
import qs from 'qs';
import { useState } from 'react';
import { getPostsApi } from '../../apis';
import Page from '../../components/page';
import Layout from '../../layout';
import { Posts } from '../../types';
import { isSameDate } from '../../utils';
interface Props {
  count: number;
  posts: Posts;
}

export default function Category({ count, posts }: Props): JSX.Element {
  const router = useRouter();
  const theme = useTheme();

  const {
    category,
    'search-type': searchTypeQueryString,
    'search-value': searchValueQueryString,
    page,
  } = router.query;

  const [searchType, setSearchType] = useState(
    searchTypeQueryString === undefined
      ? 'title+contents'
      : String(searchTypeQueryString)?.replace(' ', '+'),
  );
  const [searchValue, setSearchValue] = useState(searchValueQueryString);

  const isSmallerThanSm = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSearch = () => {
    Router.push(
      searchType && searchValue
        ? `${category}?search-type=${searchType}&search-value=${searchValue}`
        : `${category}`,
    );
  };

  return (
    <Page>
      <Layout>
        <main>
          <Box sx={{ display: 'flex', p: 1 }}>
            <Box
              sx={{ cursor: 'pointer', fontSize: '1.2rem', fontWeight: 700, color: '#000999' }}
              onClick={async () => {
                Router.push(`/posts/${category}`);
                setSearchType('title+contents');
                setSearchValue('');
              }}
            >
              {category} 채널
            </Box>
          </Box>
          <Divider />
          {isSmallerThanSm ? (
            posts.map(post => (
              <Grid
                container
                key={post.postId}
                sx={{
                  textAlign: 'center',
                  fontSize: '0.65rem',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                  borderBottom: '1px solid #e0e0e0',
                  p: 1,
                  cursor: 'pointer',
                }}
              >
                <Grid item xs={12} sx={{ textAlign: 'left', fontSize: '0.9rem' }}>
                  {post.title}
                  <span
                    style={{
                      color: '#000999',
                      fontSize: '10px',
                      fontWeight: 700,
                      marginLeft: '0.1rem',
                    }}
                  >
                    [{post.commentCount}]
                  </span>
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'left' }}>
                  {post.author}({post.ip}) |{' '}
                  {isSameDate(new Date(post.createdAt), new Date())
                    ? moment(post.createdAt).format('HH:mm')
                    : moment(post.createdAt).format('YYYY-MM-DD')}{' '}
                  | 조회: {post.view} | 추천: {post.like}
                </Grid>
              </Grid>
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
                  글쓴이
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
                >
                  <Grid item xs={0.75}>
                    {post.categoryId}
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'left' }}>
                    {post.title}
                    <span
                      style={{
                        color: '#000999',
                        fontSize: '10px',
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
                    {post.like}
                  </Grid>
                </Grid>
              ))}
            </>
          )}
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', m: isSmallerThanSm ? 1.5 : 2 }}
          >
            <Box sx={{ fontSize: '0.725rem' }}>총: {count.toLocaleString()}개</Box>
            <Button
              variant="contained"
              startIcon={<CreateIcon />}
              onClick={() => {
                Router.push(`/post/write?category=${category}`);
              }}
            >
              글쓰기
            </Button>
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
                Router.push(`${currentPath}${nextQuery}`);
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
            <Box sx={{ width: 120 }}>
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
            <FormControl sx={{ ml: 1 }} variant="standard">
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
                placeholder="검색어를 입력하세요"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={e => {
                        /* if (!searchValue) {
                          alert('검색어를 입력하세요');
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
  const { category, 'search-type': searchType, 'search-value': searchValue, page } = context.query;

  const param = {
    category: category as string,
    page: page as string,
    ...(searchType &&
      searchValue && { searchType: searchType as string, searchValue: searchValue as string }),
  };

  const res = await getPostsApi(param);
  const { count, result: posts } = res.data;

  return {
    props: { count, posts },
  };
};
