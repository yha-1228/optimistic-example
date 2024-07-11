import axios from "axios";

export interface CommentResponse {
  id: string;
  comment: string;
  createdAt: string;
}

const BASE_URL = "http://localhost:8000";

export const commentApi = {
  getComments: async () => {
    // sleep 1000ms
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return axios
      .get<CommentResponse[]>(`${BASE_URL}/comments`)
      .then((res) => res.data);
  },

  addComment: async (comment: string) => {
    // sleep 1000ms
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 意図的にエラーを起こす場合、
    // ここを有効にする
    if (Math.random() > 0.6) {
      throw new Error("Random error.");
    }

    return axios.post<CommentResponse>(`${BASE_URL}/comments`, { comment });
  },
};
