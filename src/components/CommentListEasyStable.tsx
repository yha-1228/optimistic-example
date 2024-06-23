"use client";

import type { FormEvent } from "react";
import { useRef, useState } from "react";
import { commentApi } from "@/backend/api-client";
import { useComments } from "../hooks/useComments";
import { createOptimisticComment, isOptimisticComment } from "./logics/comment";

export const CommentListEasyStable = () => {
  const { comments, setComments, refresh } = useComments();

  const [inputText, setInputText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setComments((state) => [
      ...(state || []),
      createOptimisticComment(inputText),
    ]);

    await commentApi.addComment(inputText);
    await refresh();

    setInputText("");
    inputRef.current?.focus();
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
        {comments?.toReversed().map((comment) => (
          <li key={comment.id}>
            {comment.comment}{" "}
            {isOptimisticComment(comment) ? "作成中" : comment.createdAt}
          </li>
        ))}
      </ul>
    </div>
  );
};
