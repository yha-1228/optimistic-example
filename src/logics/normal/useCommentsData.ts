import { useState, useEffect } from "react";
import { commentApi } from "@/backend/api-client";
import type { CommentState } from "@/logics/comment";

export const useCommentsData = () => {
  const [comments, setComments] = useState<CommentState[]>();
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);

    try {
      const result = await commentApi.getComments();
      setComments(result);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    setLoading(true);

    const getData = async () => {
      try {
        const result = await commentApi.getComments();
        if (!ignore) {
          setComments(result);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    getData();

    return () => {
      ignore = true;
    };
  }, []);

  return { comments, setComments, loading, refresh };
};
