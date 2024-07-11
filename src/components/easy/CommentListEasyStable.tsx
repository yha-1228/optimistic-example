"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { commentApi } from "@/backend/api-client";
import { createOptimisticComment, isOptimisticComment } from "@/logics/comment";
import { useCommentsData } from "@/logics/easy/useCommentsData";

export const CommentListEasyStable = () => {
  const { comments, setComments, refresh } = useCommentsData();

  const [inputText, setInputText] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setComments((state) => [
      ...(state || []),
      createOptimisticComment(inputText),
    ]);

    await commentApi.addComment(inputText);
    await refresh();

    setInputText("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
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
