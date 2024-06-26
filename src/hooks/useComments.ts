import { useState, useEffect } from "react";
import { commentApi } from "@/backend/api-client";
import type { CommentState } from "@/logics/comment";

export const useComments = () => {
  const [comments, setComments] = useState<CommentState[]>();
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    return commentApi
      .getComments()
      .then((result) => {
        setComments(result);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    commentApi
      .getComments()
      .then((result) => {
        if (!ignore) {
          setComments(result);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return { comments, setComments, loading, refresh };
};

export type UseCommentsReturn = ReturnType<typeof useComments>;
