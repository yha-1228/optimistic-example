import { uuid } from "uuidv4";
import type { CommentResponse } from "@/backend/api-client";

export type CommentState = CommentResponse & {
  isError?: boolean;
};

/**
 * 楽観的UIのコメントを作成する
 */
export const createOptimisticComment = (newComment: string): CommentState => {
  return {
    id: `mock-id-${uuid()}`,
    comment: newComment,
    createdAt: "",
  };
};

/**
 * 楽観的UIのコメントかどうか判定する
 */
export const isOptimisticComment = (comment: CommentState | undefined) => {
  return comment?.id.startsWith("mock-id-");
};

/**
 * 楽観的UIのコメントかどうか判定する
 */
export const findOptimisticComment = (comments: CommentState[] | undefined) => {
  return comments?.find(isOptimisticComment);
};
