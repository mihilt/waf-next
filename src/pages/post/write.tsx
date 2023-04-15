import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { postPostApi } from '../../apis';
import { toast } from 'react-toastify';

import CategoryHeader from '../../components/categoryHeader';
import Page from '../../components/page';
import Layout from '../../layout';

interface Props {}

export default function Writing({}: Props): JSX.Element {
  const router = useRouter();
  const { category } = router.query;

  const authorRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const titleRef = useRef<any>(null);
  const contentsRef = useRef<any>(null);

  const Editor = dynamic(() => import('../../components/toast-ui-editor'), { ssr: false });

  const handleWrite = async () => {
    const title = titleRef.current.value;
    const contents = contentsRef.current.querySelector(
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
    if (contentsRef.current.innerText === '\n') {
      toast.error('내용을 입력해주세요.');
      contentsRef.current.querySelector('.ProseMirror.toastui-editor-contents').focus();
      return;
    }

    let res;
    try {
      res = await postPostApi({ title, contents, category: category as string, author, password });
    } catch (e) {
      console.log(`ERROR: ${e}`);
      toast.error('글 등록에 실패했습니다.');
      return;
    }

    if (res.status === 201) {
      router.push(`/post/${category}/${res.data.categoryId}`);
      toast.success('글을 등록했습니다.');
    }
  };

  return (
    <>
      <Page>
        <Layout>
          <main>
            <CategoryHeader category={category as string} />
            <Box sx={{ p: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="category-label">카테고리</InputLabel>
                {category && (
                  <Select disabled labelId="category-label" value={category} label="카테고리">
                    <MenuItem value={category}>{category}</MenuItem>
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
              <TextField fullWidth label="제목" variant="outlined" inputRef={titleRef} />
              <Box sx={{ mt: 1.5 }} />
              <Box>
                <Editor contentsRef={contentsRef} />
              </Box>
              <Box sx={{ mt: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex' }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      router.push(`/posts/${category}`);
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
