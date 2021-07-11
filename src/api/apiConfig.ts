import { AxiosRequestConfig } from 'axios';

const { REACT_APP_FIDEL_SK_KEY } = process.env;

export type ApiResponse<DataType> = {
  status: number;
} & DataType;

export const axiosRequestConfig: AxiosRequestConfig = {
  baseURL: 'https://api-dev.fidel.uk/v1d',
  headers: {
    'fidel-key': REACT_APP_FIDEL_SK_KEY,
  },
};
