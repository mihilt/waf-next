import requestApi from '../lib/api';

export interface GetPostsApiProps {
  page?: string;
  limit?: number;
  category?: string;
  like?: number;
}

export interface GetPostApiProps {
  category: string;
  categoryId: string;
}

export interface PostPostApiProps {
  category: string;
  title: string;
  contents: string;
  author: string;
  password: string;
}

export interface LikePostApiProps {
  postId: string;
}

export interface DislikePostApiProps {
  postId: string;
}

export interface PostCommentApiProps {
  postId: string;
  author: string;
  contents: string;
  password: string;
  parentComment?: string;
}

export interface DeleteCommentApiProps {
  postId: string;
  commentId: string;
  password: string;
}

export interface LikeCommentApiProps {
  postId: string;
  commentId: string;
}

export interface DislikeCommentApiProps {
  postId: string;
  commentId: string;
}

export const getPostsApi = (data: GetPostsApiProps) => {
  return requestApi.get('post', { params: data });
};

export const getPostApi = (data: GetPostApiProps) => {
  return requestApi.get(`post/${data.category}/${data.categoryId}`);
};

export const postPostApi = (data: PostPostApiProps) => {
  return requestApi.post('post', data);
};

export const deletePostApi = (data: GetPostApiProps) => {
  return requestApi.delete('post', { params: data });
};

export const likePostApi = (data: LikePostApiProps) => {
  return requestApi.post('post/like', data);
};

export const dislikePostApi = (data: DislikePostApiProps) => {
  return requestApi.post('post/dislike', data);
};

export const postCommentApi = (data: PostCommentApiProps) => {
  return requestApi.post('comment', data);
};

export const deleteCommentApi = (data: DeleteCommentApiProps) => {
  return requestApi.delete('comment', { params: data });
};

export const likeCommentApi = (data: LikeCommentApiProps) => {
  return requestApi.post('comment/like', data);
};

export const dislikeCommentApi = (data: DislikeCommentApiProps) => {
  return requestApi.post('comment/dislike', data);
};
