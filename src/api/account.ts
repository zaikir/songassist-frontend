import type { AxiosInstance } from 'axios';
import type { User } from 'src/types/entities';

export default (axiosInstance: AxiosInstance) => {
  async function updateMe(data: Partial<User>) {
    const result = await axiosInstance.patch<User>('/users/me', data);
    return result.data;
  }

  return {
    updateMe,
  };
};
