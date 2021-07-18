import 'antd/dist/antd.css';
import { notification } from 'antd';
import { css } from 'emotion';
import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Table } from '../table';
import { TransactionPreview } from '../transaction-preview/TransactionPreview';
import { Last, Transaction } from '../../types/transaction';

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

  const showErrorNotification = () => {
    notification.error({
      message: 'An error has ocurred',
      description: 'Our team has been notified. If the problem persists, please submit a request.',
      placement: 'bottomRight',
    });
  };

  const fetchTransactions = async () => {
    const { pageSize, last } = transactionsState.pagination;

    setIsLoading(true);

    try {
      const [transactionResponse, total] = await Promise.all([
        api.transactions.fetch({ last, limit: pageSize?.toString() }),
        api.transactions.getTotals(),
      ]);

      const transactions: Transaction[] = [...transactionsState.data, ...transactionResponse.items];

      setTransactionState((currentState) => {
        return {
          ...currentState,
          data: transactions,
          pagination: {
            ...currentState.pagination,
            last: transactionResponse.last,
            total,
          },
        };
      });
    } catch (e) {
      showErrorNotification();
    } finally {
      setIsLoading(false);
    }
  };

  const handleReloadData = () => {
    setTransactionState((currentState) => {
      return {
        ...currentState,
        data: [],
        pagination: {
          ...currentState.pagination,
          last: undefined,
          total: 0,
        },
      };
    });

    setReloadToken((currentToken) => currentToken + 1);
  };

  useEffect(() => {
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
