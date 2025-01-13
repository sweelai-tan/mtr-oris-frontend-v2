import axios from 'axios';

import { useConfig } from './config-context';

export const useAxios = () => {
  const config = useConfig();

  const instance = axios.create({
    baseURL: config.api.baseURL,
    timeout: config.api.timeout,
  });

  return instance;
};
