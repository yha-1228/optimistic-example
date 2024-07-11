"use client";

import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { commentApi } from "@/backend/api-client";
import {
  findOptimisticComment,
  createOptimisticComment,
  isOptimisticComment,
} from "@/logics/comment";
import { useCommentsData } from "@/logics/normal/useCommentsData";
import { CommentListView } from "./shared/CommentListView";

export const CommentListStable = () => {
  const { comments, setComments, loading, refresh } = useCommentsData();

  const [inputText, setInputText] = useState("");

  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postComment(inputText);
  };

  const handleRetry = (selectedComment: string) => {
    postComment(selectedComment);
  };

  const postComment = async (newComment: string) => {
    setCreating(true);
    try {
      // 偽のデータが既に作成済か調べる
      const optimisticComment = findOptimisticComment(comments);
      // 偽のデータがない場合
      if (!optimisticComment) {
        setComments((state) => [
          ...(state || []),
          createOptimisticComment(inputText),
        ]);
      } else {
        // 偽のデータがあれば、それはエラーコメントと判定されている。
        // 偽のデータをエラー判定から解除する
        setComments((state) =>
          state?.map((comment) => {
            if (isOptimisticComment(comment)) {
              return { ...comment, isError: false };
            } else {
              return comment;
            }
          }),
        );
      }

      await commentApi.addComment(newComment);
      await refresh();

      setInputText("");
    } catch (error) {
      // 偽のデータをエラー判定にする
      setComments((state) =>
        state?.map((comment) => {
          if (isOptimisticComment(comment)) {
            return { ...comment, isError: true };
          } else {
            return comment;
          }
        }),
      );

      toast.error("投稿に失敗しました。");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <h2>CommentList (Stable)</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button disabled={inputText.trim().length === 0 || creating}>
          投稿
        </button>
      </form>

      <CommentListView
        loading={loading}
        comments={comments}
        onRetry={handleRetry}
      />
    </div>
  );
};
