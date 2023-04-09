import requestApi from '../lib/api';

export interface getPostsApiProps {
  page?: number;
  limit?: number;
  category?: string;
  like?: number;
}

export const getPostsApi = (data: getPostsApiProps) => {
  return requestApi.get('post', { params: data });
};
