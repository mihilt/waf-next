import axios, { AxiosInstance } from 'axios';

const requestApi: AxiosInstance = axios.create({
  // host 명시적 지정 없이는 getServerSideProps 내에서와 클라이언트에서의 host가 다르다. (localhost:80)
  baseURL: `${process.env.CLIENT_URL}/api/${process.env.API_VERSION}`,
});

export default requestApi;
