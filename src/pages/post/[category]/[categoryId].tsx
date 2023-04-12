import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Box, Button, Divider, IconButton, TextField } from '@mui/material';
import moment from 'moment';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { getPostApi, postCommentApi } from '../../../apis';
import Page from '../../../components/page';
import Layout from '../../../layout';
import { Comment, Comments } from '../../../types';

interface Props {
  author: string;
  category: string;
  categoryId: string;
  comments: Comments;
  contents: string;
  createdAt: string;
  ip: string;
  like: number;
  postId: string;
  title: string;
  view: number;
}

interface CommentSectionProps {
  comment: Comment;
}

const CommentSection = ({ comment }: CommentSectionProps) => (
  <Box sx={{ width: '100%' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
      <Box>
        {comment.author}({comment.ip})
      </Box>
      <Box>추천: {comment.like}</Box>
    </Box>
    <Box sx={{ mt: 0.5 }} />
    <Box sx={{ fontSize: '0.8rem' }}>{comment.contents}</Box>
    <Box sx={{ mt: 0.5 }} />
    <Box sx={{ fontSize: '0.7rem' }}>
      {moment(comment.createdAt).format('YYYY-MM-DD HH:mm:ss')} |{' '}
      <ThumbUpIcon
        sx={{
          fontSize: '0.9rem',
          verticalAlign: 'text-bottom',
          cursor: 'pointer',
          color: '#000999',
        }}
      />{' '}
      <ThumbDownIcon
        sx={{
          fontSize: '0.9rem',
          verticalAlign: 'text-bottom',
          cursor: 'pointer',
          color: '#909090',
        }}
      />
    </Box>
  </Box>
);
export default function CategoryId({
  author,
  category,
  categoryId,
  comments,
  contents,
  createdAt,
  ip,
  like,
  postId,
  title,
  view,
}: Props): JSX.Element {
  const router = useRouter();

  const commentAuthorRef = useRef<any>(null);
  const commentPasswordRef = useRef<any>(null);
  const commentContentsRef = useRef<any>(null);

  return (
    <Page>
      <Layout>
        <main>
          <Box sx={{ p: 2 }}>
            <Box sx={{ pl: 1, py: 1, background: '#EFEFEF' }}>{title}</Box>
            <Box sx={{ mt: 1 }} />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.7rem',
                px: 0.5,
              }}
            >
              <Box>
                {author}({ip}) | {moment(createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </Box>
              <Box>
                추천: {like} | 조회수: {view}
              </Box>
            </Box>
            <Box sx={{ mt: 1 }} />
            <Box
              sx={{ fontSize: '0.8rem', px: 0.5 }}
              dangerouslySetInnerHTML={{ __html: contents }}
            />
            <Box sx={{ mt: 5 }} />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex' }}>
                <IconButton size="large">
                  <ThumbUpIcon fontSize="inherit" sx={{ color: '#000999' }} />
                </IconButton>
                <IconButton size="large">
                  <ThumbDownIcon fontSize="inherit" />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ mt: 5 }} />
            <Divider />
            <Box sx={{ mt: 1.5 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Button
                  variant="contained"
                  onClick={() => {
                    router.back();
                  }}
                >
                  이전
                </Button>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Button variant="contained" onClick={() => {}}>
                  수정
                </Button>
                <Box sx={{ ml: 0.5 }} />
                <Button variant="contained" onClick={() => {}}>
                  삭제
                </Button>
              </Box>
            </Box>
            <Box sx={{ mt: 1.5 }} />
            {/* comment */}
            <Box sx={{ borderBottom: '2.5px solid #0000001f' }} />
            {comments.map(comment => (
              <Box key={comment.commentId}>
                <Box sx={{ mt: 1 }} />
                <CommentSection comment={comment} />
                <Box sx={{ mt: 1 }} />
                {comment.comments &&
                  comment.comments.map(commentReply => (
                    <Box key={commentReply.commentId}>
                      <Divider />
                      <Box sx={{ mt: 1 }} />
                      <Box sx={{ display: 'flex' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', pr: 1 }}>
                          <Box>└</Box>
                        </Box>
                        <CommentSection comment={commentReply} />
                      </Box>
                      <Box sx={{ mt: 1 }} />
                    </Box>
                  ))}
                <Divider />
              </Box>
            ))}
            <Box sx={{ mt: 2 }} />
            <Box sx={{ display: 'flex' }}>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <TextField
                  label="작성자"
                  sx={{ width: '100%' }}
                  inputProps={{ style: { fontSize: '0.7rem', padding: 15 } }}
                  InputLabelProps={{ style: { fontSize: '0.7rem' } }}
                  inputRef={commentAuthorRef}
                />
                <TextField
                  label="비밀번호"
                  type="password"
                  sx={{ width: '100%' }}
                  inputProps={{ style: { fontSize: '0.7rem', padding: 15 } }}
                  InputLabelProps={{ style: { fontSize: '0.7rem' } }}
                  inputRef={commentPasswordRef}
                />
              </Box>
              <Box sx={{ ml: 1 }} />
              <TextField
                sx={{ width: '100%' }}
                multiline
                rows={3}
                placeholder={'덧글을 입력해주세요.'}
                inputProps={{ style: { fontSize: '0.7rem' } }}
                inputRef={commentContentsRef}
              />
              <Box sx={{ ml: 1 }} />
              <Button
                variant="contained"
                onClick={async () => {
                  const author = commentAuthorRef.current.value;
                  const password = commentPasswordRef.current.value;
                  const contents = commentContentsRef.current.value;

                  if (!author) {
                    alert('작성자를 입력해주세요.');
                    commentAuthorRef.current.focus();
                    return;
                  }

                  if (!password) {
                    alert('비밀번호를 입력해주세요.');
                    commentPasswordRef.current.focus();
                    return;
                  }

                  if (!contents) {
                    alert('내용을 입력해주세요.');
                    commentContentsRef.current.focus();
                    return;
                  }

                  await postCommentApi({
                    postId,
                    author,
                    password,
                    contents,
                  });

                  location.reload();
                }}
              >
                등록
              </Button>
            </Box>
          </Box>
        </main>
      </Layout>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context: GetServerSidePropsContext,
) => {
  const { category, categoryId } = context.query;

  const res = await getPostApi({ category: category as string, categoryId: categoryId as string });

  return {
    props: res.data,
  };
};
