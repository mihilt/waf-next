import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { checkPasswordPostApi, patchPostApi } from '../../apis';
import CategoryHeader from '../../components/categoryHeader';
import Page from '../../components/page';

import Layout from '../../layout';
interface Props {}

export default function Edit({}: Props): JSX.Element {
  const router = useRouter();

  const [category, setCategory] = useState('');
  const [beforePassword, setBeforePassword] = useState('');
  const [postId, setPostId] = useState('');

  // TODO: useRef current.value로 값을 넣으니 mui TextField의 라벨이 값이 없는 것 처럼 보이는데 언젠가는 해결 필요
  const authorRef = useRef<any>(null);
  const newPasswordRef = useRef<any>(null);
  const titleRef = useRef<any>(null);
  const contentRef = useRef<any>(null);

  const Editor = dynamic(() => import('../../components/toast-ui-editor'), { ssr: false });

  useEffect(() => {
    (async () => {
      const { postId, password: beforePassword } = router.query;

      try {
        const res = await checkPasswordPostApi({
          postId: postId as string,
          password: beforePassword as string,
        });

        const { category, author, title, content, password } = res.data;

        setCategory(category);
        setBeforePassword(password);
        setPostId(postId as string);

        // TODO: URL 패스워드 제거 + 이는 글쓰기에서도 필요, beforePassword, newPassword 좀 더 명확하게 정리 필요

        setTimeout(() => {
          authorRef.current.value = author;
          titleRef.current.value = title;
          contentRef.current.querySelector('.ProseMirror.toastui-editor-contents').innerHTML =
            content;
        }, 500);
      } catch (e) {
        router.push('/');
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      router.push(`/post/${category}/${res.data.categorySeq}`);
      toast.success('글을 수정했습니다.');
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
                  inputRef={newPasswordRef}
                  fullWidth
                />
              </Box>
              <Box sx={{ mt: 1.5 }} />
              <TextField fullWidth label="제목" variant="outlined" inputRef={titleRef} />
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
