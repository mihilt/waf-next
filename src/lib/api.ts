import axios, { AxiosInstance } from 'axios';

const requestApi: AxiosInstance = axios.create({
  baseURL: `${process.env.API_URL}/${process.env.API_VERSION}`,
});

export default requestApi;
