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
export const isOptimisticComment = (comment: CommentResponse | undefined) => {
  return comment?.id.startsWith("mock-id-");
};

/**
 * 楽観的UIのコメントかどうか判定する
 */
export const findOptimisticComment = (
  comments: CommentResponse[] | undefined,
) => {
  return comments?.find(isOptimisticComment);
};
