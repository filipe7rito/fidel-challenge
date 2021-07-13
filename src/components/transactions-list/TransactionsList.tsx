import 'antd/dist/antd.css';
import { css } from 'emotion';
import React, { useState } from 'react';
import api from '../../api';
import { Last, Transaction } from '../../api/transactions-api/types';
import { Table } from '../table';

type TransactionsState = {
  data: Transaction[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    last?: Last;
  };
};

export function TransactionsList() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transactionsState, setTransactionState] = useState<TransactionsState>({
    data: [],
    pagination: {
      current: 1,
      pageSize: 20,
      total: 0,
    },
  });

  const [reloadToken, setReloadToken] = useState(0);

  const fetchTransactions = async () => {
    const { pageSize, last } = transactionsState.pagination;

    setIsLoading(true);

    try {
      const [transactionResponse, total] = await Promise.all([
        api.transactions.fetch({ last, limit: pageSize?.toString() }),
        api.transactions.getTotals(),
      ]);

      const transactions: Transaction[] = [...transactionsState.data, ...transactionResponse.items];

      setTransactionState({
        ...transactionsState,
        data: transactions,
        pagination: {
          ...transactionsState.pagination,
          last: transactionResponse.last,
          total,
        },
      });

      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const handleReloadData = () => {
    setReloadToken((currentToken) => currentToken + 1);
  };

  React.useEffect(() => {
    fetchTransactions();
  }, [reloadToken]);

  return (
    <div className={transactionsListStyle}>
      <h2>Transactions</h2>
      <Table
        data={transactionsState.data}
        total={transactionsState.pagination.total}
        loading={isLoading}
        fetchData={fetchTransactions}
        reload={handleReloadData}
      />
    </div>
  );
}

const transactionsListStyle = css`
  margin: auto;
  width: 80%;
`;
