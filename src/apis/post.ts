import requestApi from '../lib/api';

export interface getPostsApiProps {
  page?: string;
  limit?: number;
  category?: string;
  like?: number;
}

export const getPostsApi = (data: getPostsApiProps) => {
  return requestApi.get('post', { params: data });
};
