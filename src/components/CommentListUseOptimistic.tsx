"use client";

import type { FormEvent } from "react";
import { startTransition, useOptimistic, useRef, useState } from "react";
import toast from "react-hot-toast";
import { commentApi } from "@/backend/api-client";
import { useComments } from "@/hooks/useComments";
import {
  createOptimisticComment,
  findOptimisticComment,
  isOptimisticComment,
} from "./logics/comment";
import { CommentListView } from "./shared/CommentListView";
import type { CommentResponse } from "@/backend/api-client";

type OptimisticCommentsAction =
  | { type: "add"; newComment: string }
  | { type: "error" }
  | { type: "revert-error" };

const optimisticCommentsReducer = (
  state: CommentResponse[] | undefined,
  action: OptimisticCommentsAction,
) => {
  switch (action.type) {
    case "add": {
      // 偽のデータを作成する
      return [...(state || []), createOptimisticComment(action.newComment)];
    }
    case "error": {
      // 偽のデータをエラー判定にする
      return state?.map((comment) => {
        if (isOptimisticComment(comment)) {
          return { ...comment, isError: true };
        } else {
          return comment;
        }
      });
    }
    case "revert-error": {
      // 偽のデータをエラー判定から解除する
      return state?.map((comment) => {
        if (isOptimisticComment(comment)) {
          return { ...comment, isError: false };
        } else {
          return comment;
        }
      });
    }
    default:
      return state;
  }
};

export const CommentListUseOptimistic = () => {
  const { comments, loading, refresh } = useComments();
  const [optimisticComments, dispatchOptimisticComments] = useOptimistic(
    comments,
    optimisticCommentsReducer,
  );

  const [inputText, setInputText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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
    startTransition(async () => {
      try {
        // 偽のデータが既に作成済か調べる
        const optimisticComment = findOptimisticComment(comments);
        // 偽のデータがなければ、作成する
        if (!optimisticComment) {
          dispatchOptimisticComments({ type: "add", newComment });
        } else {
          // 偽のデータがあれば、それはエラーコメントと判定されている。
          dispatchOptimisticComments({ type: "revert-error" });
        }

        await commentApi.addComment(newComment);
        await refresh();

        setInputText("");
      } catch (error) {
        // 偽のデータをエラー判定にする
        dispatchOptimisticComments({ type: "error" });
        toast.error("投稿に失敗しました。");
      } finally {
        setCreating(false);
        inputRef.current?.focus();
      }
    });
  };

  return (
    <div>
      <h2>CommentList (useOptimistic)</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          ref={inputRef}
        />
        <button disabled={inputText.trim().length === 0 || creating}>
          投稿
        </button>
      </form>

      <CommentListView
        loading={loading}
        comments={optimisticComments}
        onRetry={handleRetry}
      />
    </div>
  );
};
