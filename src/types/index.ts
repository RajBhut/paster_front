// ─── User ───────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

// ─── Post ───────────────────────────────────────────────────────────────────
export interface Post {
  id: number;
  title: string;
  content: string;
  language: string;
  /** burn after read */
  bar: boolean;
  tags: string[];
  description: string;
  authorId: number;
  author?: {
    name: string;
    username?: string;
    avatar?: string;
  };
  views: number;
  createdAt: string;
  updatedAt?: string;
}

// ─── Paginated response ──────────────────────────────────────────────────────
export interface PaginatedPosts {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
}

// ─── Search ──────────────────────────────────────────────────────────────────
export interface SearchResponse {
  posts: Post[];
}

// ─── Tags ────────────────────────────────────────────────────────────────────
export interface TagsResponse {
  tags: string[];
}

// ─── Upvote ──────────────────────────────────────────────────────────────────
export interface UpvoteData {
  upvotecount: number;
  userupvote: boolean;
}

export interface UpvoteResponse {
  message: "Upvoted" | "Removed";
}

// ─── Auth payloads ───────────────────────────────────────────────────────────
export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  email: string;
  password: string;
  name: string;
}

// ─── Create/Update Post ───────────────────────────────────────────────────────
export interface CreatePostPayload {
  title: string;
  content: string;
  userId: number;
  bar: boolean;
  language: string;
  tags: string[];
  description: string;
}

export interface UpdatePostPayload {
  title?: string;
  content?: string;
  language?: string;
  description?: string;
  tags?: string[];
}
