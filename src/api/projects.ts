import type { AxiosInstance } from 'axios';
import type { Project } from 'src/types/entities';

export default (axiosInstance: AxiosInstance) => {
  async function getProjects() {
    const result = await axiosInstance.get<Project[]>('/projects');
    return result.data;
  }

  async function createProject(project: Omit<Project, 'id' | 'ownerUserId'>) {
    const result = await axiosInstance.post<Project>('/projects', project);
    return result.data;
  }

  async function updateProject(project: Project) {
    const result = await axiosInstance.patch<Project>(`/projects/${project.id}`, project);
    return result.data;
  }

  async function searchSongLegacy(projectId: string, song: string) {
    const { data } = await axiosInstance.get(
      `/projects/${projectId}/search-song?query=${encodeURIComponent(song)}`
    );

    return data as {
      song: string;
    }[];
  }

  async function searchSong(projectId: string, song: string) {
    const { data } = await axiosInstance.post(
      `/projects/${projectId}/search-song?query=${encodeURIComponent(song)}`,
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

  async function processPrompt(projectId: string, payload: any) {
    // First request to get the generation ID.
    const { data: initialData } = await axiosInstance.post<{ generationId: string }>(
      `/projects/${projectId}/prompt`,
      payload
    );
    const generationId = initialData.generationId;

    // Poll for the status until it's not null.
    let result = null;
    while (true) {
      const { data } = await axiosInstance.get<{ result: string | null }>(
        `/projects/${projectId}/prompt-status?id=${generationId}`
      );

      if (data.result !== null) {
        result = data;
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before polling again
    }

    return result;
  }

  return {
    getProjects,
    createProject,
    updateProject,
    searchSong,
    processPrompt,
  };
};
