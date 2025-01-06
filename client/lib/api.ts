import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const cardsApi = {
  getAll: async () => {
    const response = await api.get("/cards");
    return response.data;
  },

  create: async (data: {
    title: string;
    description: string;
    columnId: number; // Changed from string to number
    tagId?: number;
  }) => {
    const response = await api.post("/cards", data);
    return response.data;
  },

  updatePosition: async (
    cardId: string,
    newPosition: number,
    oldPosition: number,
    columnId: number,
    sourceColumnId?: number
  ) => {
    const response = await api.put(`/cards/${cardId}/position`, {
      newPosition,
      oldPosition,
      columnId,
      sourceColumnId,
    });
    return response.data;
  },
  delete: async (cardId: string) => {
    const response = await api.delete(`/cards/${cardId}`);
    return response.data;
  },
};

export const tagsApi = {
  getAll: async () => {
    const response = await api.get("/tags");
    return response.data;
  },

  create: async (data: { name: string; color: string }) => {
    const response = await api.post("/tags", data);
    return response.data;
  },

  delete: async (tagId: string) => {
    const response = await api.delete(`/tags/${tagId}`);
    return response.data;
  },
};

export const historyApi = {
  getAll: async () => {
    const response = await api.get("/history");
    return response.data;
  },

  getByDate: async (date: string) => {
    const response = await api.get(`/history/${date}`);
    return response.data;
  },
};
