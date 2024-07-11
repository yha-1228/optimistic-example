import { uuid } from "uuidv4";
import type { CommentResponse } from "@/backend/api-client";

/**
 * 楽観的UIのコメントを作成する
 */
export const createOptimisticComment = (
  newComment: string,
): CommentResponse => {
  return {
    id: `mock-id-${uuid()}`,
    comment: newComment,
    createdAt: "",
  };
};

/**
 * 楽観的UIのコメントかどうか判定する
 */
export const isOptimisticComment = (
  comment: CommentResponse | undefined,
): boolean => {
  return comment?.id.startsWith("mock-id-") || false;
};

/**
 * 楽観的UIのコメントを検索する
 */
export const findOptimisticComment = (
  comments: CommentResponse[] | undefined,
): CommentResponse | undefined => {
  return comments?.find(isOptimisticComment);
};
