import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postsApi } from "@/lib/api";
import type { CreatePostPayload, UpdatePostPayload } from "@/types";

// ─── Query keys ───────────────────────────────────────────────────────────────
export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (page: number) => [...postKeys.lists(), page] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: string | number) => [...postKeys.details(), id] as const,
  search: (q: string) => [...postKeys.all, "search", q] as const,
  tags: () => [...postKeys.all, "tags"] as const,
  upvotes: (id: number) => [...postKeys.all, "upvotes", id] as const,
};

// ─── Posts list ───────────────────────────────────────────────────────────────
export function usePostsQuery(page = 1) {
  return useQuery({
    queryKey: postKeys.list(page),
    queryFn: () => postsApi.getPosts(page),
    staleTime: 1000 * 60 * 2, // 2 min
    placeholderData: (prev) => prev,
  });
}

// ─── Single post ──────────────────────────────────────────────────────────────
export function usePostQuery(id: string | number | undefined) {
  return useQuery({
    queryKey: postKeys.detail(id!),
    queryFn: () => postsApi.getPost(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 min
  });
}

// ─── Search ───────────────────────────────────────────────────────────────────
export function useSearchQuery(q: string, limit = 10) {
  return useQuery({
    queryKey: postKeys.search(q),
    queryFn: () => postsApi.searchPosts(q, limit),
    enabled: q.trim().length > 0,
    staleTime: 1000 * 30, // 30 sec
  });
}

// ─── Tags ─────────────────────────────────────────────────────────────────────
export function useTagsQuery() {
  return useQuery({
    queryKey: postKeys.tags(),
    queryFn: postsApi.getTags,
    staleTime: 1000 * 60 * 10, // 10 min
  });
}

// ─── Upvote data ──────────────────────────────────────────────────────────────
export function useUpvoteData(postId: number | undefined) {
  return useQuery({
    queryKey: postKeys.upvotes(postId!),
    queryFn: () => postsApi.getUpvoteData(postId!),
    enabled: !!postId,
    staleTime: 1000 * 30,
  });
}

// ─── Create post ──────────────────────────────────────────────────────────────
export function useAddPost(currentPage: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePostPayload) => postsApi.createPost(payload),
    onSuccess: () => {
      // Invalidate the current page and the list so it auto-refetches
      qc.invalidateQueries({ queryKey: postKeys.list(currentPage) });
      qc.invalidateQueries({ queryKey: postKeys.tags() });
    },
  });
}

// ─── Delete post ──────────────────────────────────────────────────────────────
export function useDeletePost(currentPage: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userId }: { id: number; userId: number }) =>
      postsApi.deletePost(id, userId),
    onSuccess: (_data, variables) => {
      // Remove from cache immediately
      qc.removeQueries({ queryKey: postKeys.detail(variables.id) });
      qc.invalidateQueries({ queryKey: postKeys.list(currentPage) });
    },
  });
}

// ─── Update post ──────────────────────────────────────────────────────────────
export function useUpdatePost(id: string | number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePostPayload) => postsApi.updatePost(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: postKeys.detail(id) });
    },
  });
}

// ─── Upvote toggle ────────────────────────────────────────────────────────────
export function useUpvote(postId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId }: { userId: number }) =>
      postsApi.toggleUpvote(postId, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: postKeys.upvotes(postId) });
    },
  });
}
