import axios from "axios";
import type {
  User,
  Post,
  PaginatedPosts,
  SearchResponse,
  TagsResponse,
  UpvoteData,
  UpvoteResponse,
  LoginPayload,
  SignupPayload,
  CreatePostPayload,
  UpdatePostPayload,
} from "@/types";

const API_URL = import.meta.env.VITE_API_URL as string;

// ─── Axios instance ───────────────────────────────────────────────────────────
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: async (payload: LoginPayload): Promise<User> => {
    const { data } = await api.post<User>("/user/login", payload);
    return data;
  },

  signup: async (payload: SignupPayload): Promise<User> => {
    const { data } = await api.post<User>("/user/", payload);
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post("/user/logout", {});
  },

  getProfile: async (): Promise<User> => {
    const { data } = await api.get<User>("/user/profile");
    return data;
  },
};

// ─── Posts ────────────────────────────────────────────────────────────────────
export const postsApi = {
  getPosts: async (page = 1, limit = 12): Promise<PaginatedPosts> => {
    const { data } = await api.get<PaginatedPosts>("/post", {
      params: { page, limit },
    });
    return data;
  },

  getPost: async (id: string | number): Promise<Post> => {
    const { data } = await api.get<Post>(`/post/${id}`);
    return data;
  },

  createPost: async (payload: CreatePostPayload): Promise<Post> => {
    const { data } = await api.post<Post>("/post", payload);
    return data;
  },

  updatePost: async (id: string | number, payload: UpdatePostPayload): Promise<Post> => {
    const { data } = await api.put<Post>(`/post/${id}`, payload);
    return data;
  },

  deletePost: async (id: string | number, userId: number): Promise<{ message?: string }> => {
    const { data } = await api.delete<{ message?: string }>(`/post/${id}`, {
      data: { userId },
    });
    return data;
  },

  searchPosts: async (q: string, limit = 10): Promise<Post[]> => {
    const { data } = await api.get<SearchResponse | Post[]>("/post/search", {
      params: { q, limit },
    });
    if (Array.isArray(data)) return data;
    return (data as SearchResponse).posts ?? [];
  },

  getTags: async (): Promise<string[]> => {
    const { data } = await api.get<TagsResponse>("/post/tags");
    return data.tags ?? [];
  },

  getUpvoteData: async (postId: number): Promise<UpvoteData> => {
    const { data } = await api.get<UpvoteData>(`/post/upvotes/data/${postId}`);
    return data;
  },

  toggleUpvote: async (postId: number, userId: number): Promise<UpvoteResponse> => {
    const { data } = await api.post<UpvoteResponse>("/post/upvote", {
      postId,
      userId,
    });
    return data;
  },
};
