import { uuid } from "uuidv4";
import type { CommentResponse } from "@/backend/api-client";

export type CommentState = CommentResponse & {
  isError?: boolean;
};

export const createOptimisticComment = (newComment: string): CommentState => {
  return {
    id: `mock-id-${uuid()}`,
    comment: newComment,
    createdAt: "",
  };
};

export const isOptimisticComment = (comment: CommentState | undefined) => {
  return comment?.id.startsWith("mock-id-");
};

export const findOptimisticComment = (comments: CommentState[] | undefined) => {
  return comments?.find(isOptimisticComment);
};
