import axios from 'axios';
import { Last, Transaction } from '../../types/transaction';
import { ApiResponse, axiosRequestConfig } from '../apiConfig';

const { REACT_APP_FIDEL_PROGRAM_ID } = process.env;

export async function fetch({
  last,
  limit,
}: {
  last?: Last;
  limit?: string;
}): Promise<ApiResponse<{ items: Transaction[]; last: Last }>> {
  const response = await axios.get<ApiResponse<{ items: Transaction[]; last: Last }>>(
    `/programs/${REACT_APP_FIDEL_PROGRAM_ID}/transactions`,
    {
      params: {
        start: JSON.stringify(last),
        limit,
      },
      ...axiosRequestConfig,
    },
  );

  return response.data;
}

export async function getTotals(): Promise<number> {
  const response = await axios.get<ApiResponse<{ count: number }>>(
    `/programs/${REACT_APP_FIDEL_PROGRAM_ID}/transactions`,
    {
      params: {
        select: 'count',
      },
      ...axiosRequestConfig,
    },
  );

  return response.data.count;
}
