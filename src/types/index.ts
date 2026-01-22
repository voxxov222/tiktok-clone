export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
}

export interface Video {
  id: string;
  userId: string;
  videoUrl: string;
  thumbnailUrl?: string;
  description?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
  user?: User;
}

export interface Comment {
  id: string;
  userId: string;
  videoId: string;
  content: string;
  createdAt: string;
  user?: User;
}
