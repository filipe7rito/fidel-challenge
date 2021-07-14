import 'antd/dist/antd.css';
import { css } from 'emotion';
import React, { useState } from 'react';
import api from '../../api';
import { Last, Transaction } from '../../api/transactions-api/types';
import { Table } from '../table';
import { TransactionPreview } from '../transaction-preview/TransactionPreview';

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
  const [reloadToken, setReloadToken] = useState(0);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactionsState, setTransactionState] = useState<TransactionsState>({
    data: [],
    pagination: {
      current: 1,
      pageSize: 20,
      total: 0,
    },
  });

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
    setTransactionState({
      ...transactionsState,
      data: [],
      pagination: {
        ...transactionsState.pagination,
        last: undefined,
      },
    });
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
        loading={isLoading}
        total={transactionsState.pagination.total}
        fetchData={fetchTransactions}
        reload={handleReloadData}
        onRowSelect={(transaction: Transaction) => setSelectedTransaction(transaction)}
      />

      <TransactionPreview
        transaction={selectedTransaction}
        onClosePreview={() => setSelectedTransaction(null)}
      />
    </div>
  );
}

const transactionsListStyle = css`
  margin: auto;
  width: 80%;
`;
