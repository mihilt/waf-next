import requestApi from '../lib/api';

export interface UploadApiProps {
  formData: FormData;
}

export const uploadApi = ({ formData }: UploadApiProps) => {
  return requestApi.post('upload', formData);
};
