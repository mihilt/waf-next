import CloseIcon from '@mui/icons-material/Close';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Box, Button, Divider, IconButton, Modal, TextField } from '@mui/material';
import moment from 'moment';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';

import {
  checkPasswordPostApi,
  deleteCommentApi,
  deletePostApi,
  dislikeCommentApi,
  dislikePostApi,
  getPostApi,
  likeCommentApi,
  likePostApi,
  postCommentApi,
} from '../../../apis';
import CategoryHeader from '../../../components/categoryHeader';
import Page from '../../../components/page';
import Layout from '../../../layout';
import { Comment, Comments, Post } from '../../../types';

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
  parentCommentId?: string;
}

interface CommentInputSectionProps {
  parentCommentId?: string;
}

interface DeleteEditModalProps {
  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;
  modalApi: any;
  modalDataForApi: any;
  modalApiSuccessedFunc: any;
}

const DeleteEditModal = ({
  openModal,
  setOpenModal,
  modalApi,
  modalDataForApi,
  modalApiSuccessedFunc,
}: DeleteEditModalProps) => {
  const passwordRef = useRef<any>(null);

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <Modal open={openModal} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          border: '1px solid #707070',
          boxShadow: 24,
          p: 4,
          color: '#404040',
        }}
      >
        <CloseIcon
          sx={{ cursor: 'pointer', position: 'absolute', top: '15px', right: '15px' }}
          onClick={handleClose}
        />
        <Box sx={{ textAlign: 'center', fontSize: '0.9rem', fontWeight: 500 }}>
          비밀번호를 입력해주세요.
        </Box>
        <Box sx={{ mt: 3, width: '270px', display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            label="비밀번호"
            type="password"
            autoComplete="current-password"
            size="small"
            inputRef={passwordRef}
          />
          <Button
            variant="contained"
            onClick={async () => {
              const password = passwordRef.current.value;

              let res;
              try {
                res = await modalApi({
                  ...modalDataForApi,
                  password,
                });
              } catch (e) {
                toast.error('비밀번호가 일치하지 않습니다.');
                passwordRef.current.focus();
                return;
              }

              modalApiSuccessedFunc(res.data);
            }}
          >
            확인
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

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
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalApi, setModalApi] = useState<any>();
  const [modalDataForApi, setModalDataForApi] = useState<any>();
  const [modalApiSuccessedFunc, setModalApiSuccessedFunc] = useState<any>();

  const router = useRouter();

  const CommentInputSection = ({ parentCommentId }: CommentInputSectionProps) => {
    const commentAuthorRef = useRef<any>(null);
    const commentPasswordRef = useRef<any>(null);
    const commentContentsRef = useRef<any>(null);

    return (
      <>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <TextField
              label="작성자"
              autoComplete="username"
              sx={{ width: '100%' }}
              inputProps={{ style: { fontSize: '0.7rem', padding: 15 } }}
              InputLabelProps={{ style: { fontSize: '0.7rem' } }}
              inputRef={commentAuthorRef}
            />
            <TextField
              label="비밀번호"
              type="password"
              autoComplete="current-password"
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
            placeholder={'댓글을 입력해주세요.'}
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
                toast.error('작성자를 입력해주세요.');
                commentAuthorRef.current.focus();
                return;
              }

              if (!password) {
                toast.error('비밀번호를 입력해주세요.');
                commentPasswordRef.current.focus();
                return;
              }

              if (!contents) {
                toast.error('내용을 입력해주세요.');
                commentContentsRef.current.focus();
                return;
              }

              await postCommentApi({
                postId,
                author,
                password,
                contents,
                parentComment: parentCommentId,
              });

              router.replace(router.asPath, undefined, { scroll: false });

              toast.success('댓글을 등록했습니다.');
            }}
          >
            등록
          </Button>
        </Box>
        <Box sx={{ mt: 1 }} />
      </>
    );
  };

  const CommentSection = ({ comment, parentCommentId }: CommentSectionProps) => {
    const [isOpenReply, setIsOpenReply] = useState(false);

    if (comment.deleted) {
      return (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
            <Box sx={{ color: '#404040', fontSize: '0.8rem', fontWeight: 450 }}>
              [삭제된 댓글입니다.]
            </Box>
            <Box>추천: {comment.like}</Box>
          </Box>
          <Box sx={{ mt: 0.5 }} />
          <Box sx={{ fontSize: '0.7rem' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              {moment(comment.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            </Box>
          </Box>
        </Box>
      );
    }

    return (
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              {moment(comment.createdAt).format('YYYY-MM-DD HH:mm:ss')} |{' '}
              <ThumbUpIcon
                sx={{
                  fontSize: '0.9rem',
                  verticalAlign: 'text-bottom',
                  cursor: 'pointer',
                  color: '#000999',
                }}
                onClick={async () => {
                  await likeCommentApi({
                    postId,
                    commentId: comment.commentId,
                  });
                  router.replace(router.asPath, undefined, { scroll: false });
                  toast.success('댓글을 추천했습니다.');
                }}
              />{' '}
              <ThumbDownIcon
                sx={{
                  fontSize: '0.9rem',
                  verticalAlign: 'text-bottom',
                  cursor: 'pointer',
                  color: '#909090',
                }}
                onClick={async () => {
                  await dislikeCommentApi({
                    postId,
                    commentId: comment.commentId,
                  });
                  router.replace(router.asPath, undefined, { scroll: false });
                  toast.success('댓글을 비추천했습니다.');
                }}
              />
            </Box>
            <Box sx={{ display: 'flex' }}>
              {!parentCommentId && (
                <>
                  <Box
                    sx={{ cursor: 'pointer', color: '#000666', fontWeight: 550 }}
                    onClick={() => {
                      // TODO: 다른 열려있는 답글 닫기
                      setIsOpenReply(e => !e);
                    }}
                  >
                    답글
                  </Box>
                  <Box sx={{ ml: 0.5 }} />
                </>
              )}
              <Box
                sx={{ cursor: 'pointer', color: '#000666', fontWeight: 550 }}
                onClick={() => {
                  setOpenModal(true);
                  setModalApi(() => deleteCommentApi);
                  setModalDataForApi({ postId, commentId: comment.commentId });
                  setModalApiSuccessedFunc(() => () => {
                    router.replace(router.asPath, undefined, { scroll: false });
                    setOpenModal(false);
                    toast.success('댓글을 삭제했습니다.');
                  });
                }}
              >
                삭제
              </Box>
            </Box>
          </Box>
        </Box>
        {!parentCommentId && isOpenReply && (
          <>
            <Box sx={{ mt: 1.25 }} />
            <Divider />
            <Box sx={{ mt: 2 }} />
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', pr: 1 }}>
                <Box>└</Box>
              </Box>
              <Box sx={{ width: '100%' }}>
                <CommentInputSection parentCommentId={comment.commentId} />
              </Box>
            </Box>
          </>
        )}
      </Box>
    );
  };

  return (
    <Page>
      <Layout>
        <main>
          <CategoryHeader category={category as string} />
          <DeleteEditModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            modalApi={modalApi}
            modalDataForApi={modalDataForApi}
            modalApiSuccessedFunc={modalApiSuccessedFunc}
          />
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
                조회수: {view} | 추천: {like}
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
                <IconButton
                  size="large"
                  onClick={async () => {
                    await likePostApi({
                      postId,
                    });
                    router.replace(router.asPath, undefined, { scroll: false });
                    toast.success('글을 추천했습니다.');
                  }}
                >
                  <ThumbUpIcon fontSize="inherit" sx={{ color: '#000999' }} />
                </IconButton>
                <IconButton
                  size="large"
                  onClick={async () => {
                    await dislikePostApi({
                      postId,
                    });
                    router.replace(router.asPath, undefined, { scroll: false });
                    toast.success('글을 비추천했습니다.');
                  }}
                >
                  <ThumbDownIcon fontSize="inherit" />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ mt: 5 }} />
            <Divider />
            <Box sx={{ mt: 1.5 }} />
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
              <Box sx={{ display: 'flex' }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpenModal(true);
                    setModalApi(() => checkPasswordPostApi);
                    setModalDataForApi({ postId });
                    setModalApiSuccessedFunc(() => (post: Post) => {
                      router.push({
                        pathname: '/post/edit',
                        query: { postId: post.postId, password: post.password },
                      });
                    });
                  }}
                >
                  수정
                </Button>
                <Box sx={{ ml: 0.5 }} />
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpenModal(true);
                    setModalApi(() => deletePostApi);
                    setModalDataForApi({ postId });
                    setModalApiSuccessedFunc(() => () => {
                      router.push(`/posts/${category}`);
                      setOpenModal(false);
                      toast.success('글을 삭제했습니다.');
                    });
                  }}
                >
                  삭제
                </Button>
              </Box>
            </Box>
            <Box sx={{ mt: 1.5 }} />
            {/* comment */}
            <Box sx={{ borderBottom: '2.5px solid #0000001f' }} />
            {comments.map(comment => (
              <Box key={comment.commentId}>
                <Box sx={{ mt: 1.25 }} />
                <CommentSection comment={comment} />
                <Box sx={{ mt: 1.25 }} />
                {comment.comments &&
                  comment.comments.map(commentReply => (
                    <Box key={commentReply.commentId}>
                      <Divider />
                      <Box sx={{ mt: 1.25 }} />
                      <Box sx={{ display: 'flex' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', pr: 1 }}>
                          <Box>└</Box>
                        </Box>
                        <CommentSection
                          comment={commentReply}
                          parentCommentId={comment.commentId}
                        />
                      </Box>
                      <Box sx={{ mt: 1.25 }} />
                    </Box>
                  ))}
                <Divider />
              </Box>
            ))}
            <Box sx={{ mt: 2 }} />
            <CommentInputSection />
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

  let res;
  try {
    res = await getPostApi({ category: category as string, categoryId: categoryId as string });
  } catch (e) {
    return {
      /* redirect: {
        destination: `/posts/${category}`,
        permanent: false,
      }, */
      notFound: true,
    };
  }

  return {
    props: res.data,
  };
};
