import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Box, Divider } from '@mui/material';
import moment from 'moment';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getPostApi } from '../../../apis';
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
          color: '#909090',
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
            <Box sx={{ mt: 1 }} />
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
