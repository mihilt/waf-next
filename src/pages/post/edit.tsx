import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { checkPasswordPostApi, getCategoryApi, patchPostApi } from '../../apis';
import CategoryHeader from '../../components/categoryHeader';
import Page from '../../components/page';

import Layout from '../../layout';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Category } from '../../types';
import { clearQueryParams } from '../../utils';
interface Props {
  category: Category;
  categoryId: string;
  postId: string;
  author: string;
  title: string;
  password: string;
  content: string;
}

export default function Edit({
  category,
  categoryId,
  postId,
  author,
  title,
  password: beforePassword,
  content,
}: Props): JSX.Element {
  clearQueryParams();

  const router = useRouter();

  const authorRef = useRef<any>(null);
  const newPasswordRef = useRef<any>(null);
  const titleRef = useRef<any>(null);
  const contentRef = useRef<any>(null);

  const Editor = dynamic(() => import('../../components/toast-ui-editor'), { ssr: false });

  useEffect(() => {
    const interval = setInterval(() => {
      const editorElement = contentRef.current?.querySelector(
        '.ProseMirror.toastui-editor-contents',
      );
      if (editorElement) {
        editorElement.innerHTML = content;
        clearInterval(interval);
      }
    }, 500);
  }, [content]);

  const handleEdit = async () => {
    const title = titleRef.current.value;
    const content = contentRef.current.querySelector(
      '.ProseMirror.toastui-editor-contents',
    ).innerHTML;
    const author = authorRef.current.value;
    const newPassword = newPasswordRef.current.value;

    if (!author) {
      toast.error('작성자를 입력해주세요.');
      authorRef.current.focus();
      return;
    }

    if (!newPassword) {
      toast.error('비밀번호를 입력해주세요.');
      newPasswordRef.current.focus();
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
      res = await patchPostApi({
        postId,
        title,
        content,
        author,
        newPassword,
        password: beforePassword,
      });
    } catch (e) {
      console.log(`ERROR: ${e}`);
      toast.error('글 수정에 실패했습니다.');
      return;
    }

    if (res.status === 200) {
      router.push(`/post/${categoryId}/${res.data.categorySeq}`);
      toast.success('글을 수정했습니다.');
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
                  defaultValue={author}
                  fullWidth
                />
                <Box sx={{ ml: 1 }} />
                <TextField
                  label="비밀번호"
                  type="password"
                  autoComplete="current-password"
                  variant="outlined"
                  inputRef={newPasswordRef}
                  defaultValue={beforePassword}
                  fullWidth
                />
              </Box>
              <Box sx={{ mt: 1.5 }} />
              <TextField
                fullWidth
                label="제목"
                variant="outlined"
                inputRef={titleRef}
                defaultValue={title}
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
                <Button variant="contained" onClick={handleEdit}>
                  수정
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
  const { postId, password: beforePassword } = context.query;

  let res;
  try {
    res = await checkPasswordPostApi({
      postId: postId as string,
      password: beforePassword as string,
    });

    const { categoryId } = res.data;

    const getCategoryApiRes = await getCategoryApi({
      categoryId: categoryId as string,
    });

    res.data.category = getCategoryApiRes.data.category;
  } catch (e) {
    return {
      notFound: true,
    };
  }

  return {
    props: res.data,
  };
};
