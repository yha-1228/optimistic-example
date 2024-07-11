import { useState, useEffect } from "react";
import { commentApi } from "@/backend/api-client";
import type { CommentResponse } from "@/backend/api-client";

// 近年ではSWRやReact Queryを使うでしょう
export const useCommentsData = () => {
  const [comments, setComments] = useState<CommentResponse[]>();

  const refresh = async () => {
    const result = await commentApi.getComments();
    setComments(result);
  };

  useEffect(() => {
    let ignore = false;

    const getData = async () => {
      const result = await commentApi.getComments();
      if (!ignore) {
        setComments(result);
      }
    };

    getData();

    return () => {
      ignore = true;
    };
  }, []);

  return { comments, setComments, refresh };
};
