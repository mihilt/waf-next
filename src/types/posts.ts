export interface Posts extends Array<Post> {}
export interface Comments extends Array<Comment> {}

export interface Post {
  postId: string;
  categorySeq: string;
  title: string;
  ip: string;
  commentCount: number;
  author: string;
  createdAt: string;
  view: number;
  like: number;
  password?: string;
}

export interface Comment {
  commentId: string;
  ip: string;
  author: string;
  content: string;
  like: number;
  deleted: boolean;
  createdAt: string;
  comments?: Comments;
}

export interface Category {
  categoryId: string;
  name: string;
  auth?: boolean;
  recentPosts?: Post[];
}
