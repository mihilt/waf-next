import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import { getCategoryApi, postPostApi } from '../../apis';
import ToastUiSkeleton from '../../components/toast-ui-skeleton';

import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import CategoryHeader from '../../components/categoryHeader';
import Page from '../../components/page';
import Layout from '../../layout';
import { Category } from '../../types';

interface Props {
  category: Category;
}

export default function Writing({ category }: Props): JSX.Element {
  const router = useRouter();
  const { categoryId } = router.query;

  const authorRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const titleRef = useRef<any>(null);
  const contentRef = useRef<any>(null);

  const Editor = dynamic(() => import('../../components/toast-ui-editor'), {
    ssr: false,
    loading: () => <ToastUiSkeleton />,
  });

  const handleWrite = async () => {
    const title = titleRef.current.value;
    const content = contentRef.current.querySelector(
      '.ProseMirror.toastui-editor-contents',
    ).innerHTML;
    const author = authorRef.current.value;
    const password = passwordRef.current.value;

    if (!author) {
      toast.error('작성자를 입력해주세요.');
      authorRef.current.focus();
      return;
    }

    if (!password) {
      toast.error('비밀번호를 입력해주세요.');
      passwordRef.current.focus();
      return;
    }

    if (!title) {
      toast.error('제목을 입력해주세요.');
      titleRef.current.focus();
      return;
    }
    if (contentRef.current.innerText === '\n') {
      toast.error('내용을 입력해주세요.');
      contentRef.current.querySelector('.ProseMirror.toastui-editor-contents').focus();
      return;
    }

    let res;
    try {
      res = await postPostApi({
        title,
        content,
        categoryId: categoryId as string,
        author,
        password,
      });
    } catch (e) {
      console.log(`ERROR: ${e}`);
      toast.error('글 등록에 실패했습니다.');
      return;
    }

    if (res.status === 201) {
      router.push(`/post/${categoryId}/${res.data.categorySeq}`);
      toast.success('글을 등록했습니다.');
    }
  };

  return (
    <>
      <Page>
        <Layout>
          <main>
            <CategoryHeader category={category} />
            <Box sx={{ p: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="category-label">카테고리</InputLabel>
                {category && (
                  <Select
                    disabled
                    labelId="category-label"
                    value={category.categoryId}
                    label="카테고리"
                  >
                    <MenuItem value={category.categoryId}>{category.name}</MenuItem>
                  </Select>
                )}
              </FormControl>
              <Box sx={{ mt: 1.5 }} />
              <Box sx={{ display: 'flex' }}>
                <TextField
                  label="작성자"
                  autoComplete="username"
                  variant="outlined"
                  inputRef={authorRef}
                  fullWidth
                />
                <Box sx={{ ml: 1 }} />
                <TextField
                  label="비밀번호"
                  type="password"
                  autoComplete="current-password"
                  variant="outlined"
                  inputRef={passwordRef}
                  fullWidth
                />
              </Box>
              <Box sx={{ mt: 1.5 }} />
              <TextField
                fullWidth
                label="제목"
                variant="outlined"
                inputRef={titleRef}
                inputProps={{
                  maxLength: 100,
                }}
              />
              <Box sx={{ mt: 1.5 }} />
              <Box>
                <Editor contentRef={contentRef} />
              </Box>
              <Box sx={{ mt: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex' }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      router.push(`/posts/${categoryId}`);
                    }}
                  >
                    목록
                  </Button>
                  <Box sx={{ ml: 0.5 }} />
                  <Button
                    variant="contained"
                    onClick={() => {
                      router.back();
                    }}
                  >
                    이전
                  </Button>
                </Box>
                <Button variant="contained" onClick={handleWrite}>
                  등록
                </Button>
              </Box>
            </Box>
          </main>
        </Layout>
      </Page>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context: GetServerSidePropsContext,
) => {
  const { categoryId } = context.query;

  let res;
  try {
    res = await getCategoryApi({
      categoryId: categoryId as string,
    });
  } catch (e) {
    return {
      notFound: true,
    };
  }

  return {
    props: res.data,
  };
};
