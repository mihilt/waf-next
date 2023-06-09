import requestApi from '../lib/api';

export interface GetCategoriesApiProps {
  isGetRecentPosts?: boolean;
}

export interface getCategoryApiProps {
  categoryId: string;
}
export interface GetPostsApiProps {
  page?: string;
  limit?: number;
  categoryId?: string;
  like?: string;
}

export interface GetPostApiProps {
  categoryId: string;
  categorySeq: string;
}

export interface PostPostApiProps {
  categoryId: string;
  title: string;
  content: string;
  author: string;
  password: string;
}

export interface LikePostApiProps {
  postId: string;
}

export interface DislikePostApiProps {
  postId: string;
}

export interface CheckPasswordPostApiProps {
  postId: string;
  password: string;
}

export interface PatchPostApiProps {
  postId: string;
  author: string;
  title: string;
  content: string;
  password: string;
  newPassword: string;
}

export interface PostCommentApiProps {
  postId: string;
  author: string;
  content: string;
  password: string;
  parentCommentId?: string;
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

// Category
export const getCategoriesApi = (data: GetCategoriesApiProps) => {
  return requestApi.get('category', { params: data });
};

export const getCategoryApi = (data: getCategoryApiProps) => {
  return requestApi.get(`category/${data.categoryId}`);
};

// Post
export const getPostsApi = (data: GetPostsApiProps) => {
  return requestApi.get('post', { params: data });
};

export const getPostApi = (data: GetPostApiProps) => {
  return requestApi.get(`post/${data.categoryId}/${data.categorySeq}`);
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

export const checkPasswordPostApi = (data: CheckPasswordPostApiProps) => {
  return requestApi.post('post/check-password', data);
};

export const patchPostApi = (data: PatchPostApiProps) => {
  return requestApi.patch(`post/${data.postId}`, data);
};

// Comment
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
