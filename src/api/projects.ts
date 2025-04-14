import type { AxiosInstance } from 'axios';
import type { Chat } from 'src/types/entities';

export default (axiosInstance: AxiosInstance) => {
  async function searchSong(song: string) {
    const { data } = await axiosInstance.post(
      `/chats/search-song?query=${encodeURIComponent(song)}`,
      {
        search: song,
      }
    );

    return data.results as {
      artistId: string;
      artistName: string;
      artworkUrl100: string;
      previewUrl: string;
      trackId: string;
      trackName: string;
    }[];
  }

  async function getChats() {
    const { data } = await axiosInstance.get<Chat[]>(`/chats`);

    return data;
  }
  async function getChatInfo(chat: any) {
    const { data } = await axiosInstance.get<Chat>(`/chats/${chat.id}`);

    return data;
  }

  async function processPrompt(payload: any) {
    const { data: initialData } = await axiosInstance.post<{ generationId: string }>(
      `/chats/prompt`,
      payload
    );
    const generationId = initialData.generationId;

    return { chatId: generationId };
  }

  async function sendFeedback(chatId: string, payload: any) {
    await axiosInstance.post(`/chats/${chatId}/feedback`, payload);
  }

  async function sendReview(chatId: string, payload: any) {
    await axiosInstance.post(`/chats/${chatId}/review`, payload);
  }

  async function regeneratePrompt(chatId: string) {
    await axiosInstance.post(`/chats/${chatId}/regenerate`);

    return;
  }

  async function waitForChatResponse(chatId: string) {
    let result = null;
    while (true) {
      const { data } = await axiosInstance.get<
        Chat & {
          feedbacks: { text: string; feedback: number }[];
        }
      >(`/chats/prompt-status?id=${chatId}`);

      if (data.response !== null || data.error !== null) {
        result = data;
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return result;
  }

  return {
    sendFeedback,
    sendReview,
    getChats,
    searchSong,
    getChatInfo,
    processPrompt,
    regeneratePrompt,
    waitForChatResponse,
  };
};
