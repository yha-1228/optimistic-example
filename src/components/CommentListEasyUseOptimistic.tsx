"use client";

import type { FormEvent } from "react";
import { startTransition, useOptimistic, useRef, useState } from "react";
import { commentApi } from "@/backend/api-client";
import { createOptimisticComment, isOptimisticComment } from "@/logics/comment";
import { useComments } from "../hooks/useComments";

export const CommentListEasyUseOptimistic = () => {
  const { comments, refresh } = useComments();
  const [optimisticComments, addoptimisticComment] = useOptimistic(
    comments,
    (state, newComment: string) => [
      ...(state || []),
      createOptimisticComment(newComment),
    ],
  );

  const [inputText, setInputText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      addoptimisticComment(inputText);

      await commentApi.addComment(inputText);
      await refresh();

      setInputText("");
      inputRef.current?.focus();
    });
  };

  return (
    <div>
      <h2>CommentList (Easy Stable)</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          ref={inputRef}
        />
        <button disabled={inputText.trim().length === 0}>投稿</button>
      </form>

      <ul>
        {optimisticComments?.toReversed().map((comment) => (
          <li key={comment.id}>
            {comment.comment}{" "}
            {isOptimisticComment(comment) ? "作成中" : comment.createdAt}
          </li>
        ))}
      </ul>
    </div>
  );
};
