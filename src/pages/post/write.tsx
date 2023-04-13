import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import dynamic from 'next/dynamic';
import Router, { useRouter } from 'next/router';
import { useRef } from 'react';
import { postPostApi } from '../../apis';
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
      alert('작성자를 입력해주세요.');
      authorRef.current.focus();
      return;
    }

    if (!password) {
      alert('비밀번호를 입력해주세요.');
      passwordRef.current.focus();
      return;
    }

    if (!title) {
      alert('제목을 입력해주세요.');
      titleRef.current.focus();
      return;
    }
    if (contentsRef.current.innerText === '\n') {
      alert('내용을 입력하세요.');
      contentsRef.current.querySelector('.ProseMirror.toastui-editor-contents').focus();
      return;
    }

    let res;
    try {
      res = await postPostApi({ title, contents, category: category as string, author, password });
    } catch (e) {
      console.log(`ERROR: ${e}`);
      alert('글 작성에 실패했습니다.');
      return;
    }

    if (res.status === 201) {
      Router.push(`/post/${category}/${res.data.categoryId}`);
    }
  };

  return (
    <>
      <Page>
        <Layout>
          <main>
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
                <Button variant="contained" color="gray">
                  이전
                </Button>
                <Button variant="contained" onClick={handleWrite}>
                  작성
                </Button>
              </Box>
            </Box>
          </main>
        </Layout>
      </Page>
    </>
  );
}
