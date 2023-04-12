export interface Posts extends Array<Post> {}
export interface Comments extends Array<Comment> {}

export interface Post {
  postId: string;
  categoryId: string;
  title: string;
  ip: string;
  commentCount: number;
  author: string;
  createdAt: string;
  view: number;
  like: number;
}

export interface Comment {
  commentId: string;
  ip: string;
  author: string;
  contents: string;
  like: number;
  createdAt: string;
  comments?: Comments;
}
