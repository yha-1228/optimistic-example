"use client";

import type { FormEvent } from "react";
import { useOptimistic, useState, startTransition } from "react";
import { commentApi } from "@/backend/api-client";
import { createOptimisticComment, isOptimisticComment } from "@/logics/comment";
import { useCommentsData } from "@/logics/easy/useCommentsData";

export const CommentListEasyUseOptimistic = () => {
  const { comments, refresh } = useCommentsData();

  const [optimisticComments, addoptimisticComment] = useOptimistic(
    comments,
    (state, newComment: string) => [
      ...(state || []),
      createOptimisticComment(newComment),
    ],
  );

  const [inputText, setInputText] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      addoptimisticComment(inputText);

      await commentApi.addComment(inputText);
      await refresh();

      setInputText("");
    });
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
