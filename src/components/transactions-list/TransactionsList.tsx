import 'antd/dist/antd.css';
import { notification } from 'antd';
import { css } from 'emotion';
import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Table } from '../table';
import { TransactionPreview } from '../transaction-preview/TransactionPreview';
import { Last, Transaction } from '../../types/transaction';

type Pagination = {
  current: number;
  pageSize: number;
  total: number;
  last: Last | undefined;
};

const PAGE_SIZE = 20;

export function TransactionsList() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: PAGE_SIZE,
    total: 0,
    last: undefined,
  });

  const showErrorNotification = () => {
    notification.error({
      message: 'An error has ocurred',
      description: 'Our team has been notified. If the problem persists, please submit a request.',
      placement: 'bottomRight',
    });
  };

  const fetchTransactions = async () => {
    const { pageSize, last } = pagination;

    setIsLoading(true);

    try {
      // Fetch transactions and total number of transactions
      const [transactionResponse, total] = await Promise.all([
        api.transactions.fetch({ last, limit: pageSize }),
        api.transactions.getTotals(),
      ]);

      const newTransactions: Transaction[] = [...transactions, ...transactionResponse.items];

      setTransactions(newTransactions);

      setPagination({
        ...pagination,
        last: transactionResponse.last,
        total,
      });
    } catch (e) {
      showErrorNotification();
    } finally {
      setIsLoading(false);
    }
  };

  const handleReloadData = () => {
    setTransactions([]);

    setPagination({
      ...pagination,
      total: 0,
      last: undefined,
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
        data={transactions}
        loading={isLoading}
        total={pagination.total}
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
