import axios, { AxiosInstance } from 'axios';

const apiUrl = process.env.API_URL;

const requestApi: AxiosInstance = axios.create({
  baseURL: `${apiUrl}/${process.env.API_VERSION}`,
});

export default requestApi;
