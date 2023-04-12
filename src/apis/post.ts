import requestApi from '../lib/api';

export interface getPostsApiProps {
  page?: string;
  limit?: number;
  category?: string;
  like?: number;
}

export interface getPostApiProps {
  category: string;
  categoryId: string;
}

export interface postPostApiProps {
  category: string;
  title: string;
  contents: string;
  author: string;
  password: string;
}

export interface postCommentApiProps {
  postId: string;
  author: string;
  contents: string;
  password: string;
  parentComment?: string;
}

export const getPostsApi = (data: getPostsApiProps) => {
  return requestApi.get('post', { params: data });
};

export const getPostApi = (data: getPostApiProps) => {
  return requestApi.get(`post/${data.category}/${data.categoryId}`);
};

export const postPostApi = (data: postPostApiProps) => {
  return requestApi.post('post', data);
};

export const postCommentApi = (data: postCommentApiProps) => {
  return requestApi.post('comment', data);
};
