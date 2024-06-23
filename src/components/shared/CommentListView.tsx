import { format } from "date-fns";
import { isOptimisticComment } from "../logics/comment";
import type { UseCommentsReturn } from "../../hooks/useComments";

export interface CommentListViewProps extends Partial<UseCommentsReturn> {
  onRetry?: (selectedComment: string) => void;
}

export const CommentListView = ({
  loading,
  comments,
  onRetry,
}: CommentListViewProps) => {
  if (!comments) {
    return null;
  }

  const loadedComments = comments.filter(
    (comment) => !isOptimisticComment(comment),
  );

  return (
    <div>
      <p>
        {loading
          ? "一覧を読み込み中..."
          : `一覧を読み込みました。 (${loadedComments?.length}件)`}
      </p>

      <hr />

      <ul>
        {[...comments].reverse()?.map((comment) => {
          if (comment.isError) {
            return (
              <li key={comment.id} style={{ display: "flex" }}>
                <div>{comment.comment}</div>

                {comment.isError && (
                  <button
                    type="button"
                    onClick={() => onRetry?.(comment.comment)}
                    style={{ marginLeft: 8 }}
                  >
                    再投稿
                  </button>
                )}
              </li>
            );
          }

          return (
            <li key={comment.id} style={{ display: "flex" }}>
              <div>
                {comment.comment}{" "}
                <span style={{ color: "rgb(120,120,120)", fontSize: 14 }}>
                  {isOptimisticComment(comment)
                    ? "投稿中..."
                    : `(${format(
                        comment.createdAt,
                        "yyyy年MM月dd日 hh:mm:ss",
                      )} に投稿)`}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
