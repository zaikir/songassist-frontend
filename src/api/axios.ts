import axios from 'axios';

import { CONFIG } from 'src/global-config';

import auth from './auth';
import account from './account';
import projects from './projects';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

// ----------------------------------------------------------------------

export const api = {
  ...auth(axiosInstance),
  ...account(axiosInstance),
  ...projects(axiosInstance),
};
