import requestApi from '../lib/api';

export interface getPostsApiProps {
  page?: string;
  limit?: number;
  category?: string;
  like?: number;
}

export interface postPostApiProps {
  category: string;
  title: string;
  contents: string;
  author: string;
  password: string;
}

export const getPostsApi = (data: getPostsApiProps) => {
  return requestApi.get('post', { params: data });
};

export const postPostApi = (data: postPostApiProps) => {
  return requestApi.post('post', data);
};
