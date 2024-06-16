import type { CommentState } from "@/hooks/useComments";

export const isOptimisticComment = (comment: CommentState | undefined) => {
  return comment?.id === "mock-id";
};

export const findOptimisticComment = (comments: CommentState[] | undefined) => {
  return comments?.find(isOptimisticComment);
};
