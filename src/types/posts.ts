export interface Posts extends Array<Post> {}

export interface Post {
  postId: string;
  title: string;
  ip: string;
  commentCount: number;
  author: string;
  createdAt: string;
  view: number;
  like: number;
}
