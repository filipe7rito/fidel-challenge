import 'antd/dist/antd.css';
import { css } from 'emotion';
import React, { useEffect, useState } from 'react';
import api from './api';
import { Last, Transaction } from './api/transactionsApi/types';
import { Table } from './components/table/Table';

type TransactionsState = {
  data: Transaction[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    last?: Last;
  };
};

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transactionsState, setTransactionState] = useState<TransactionsState>({
    data: [],
    pagination: {
      current: 1,
      pageSize: 20,
      total: 0,
    },
  });

  /* const [reloadToken, setReloadToken] = useState(0); */

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

  useEffect(() => {
    fetchTransactions();
  }, []);

  const Footer = () => <footer className="footer" />;

  return (
    <div className={wrapper}>
      <div className={container}>
        <main>
          <div>
            <h2>Transactions</h2>
            <Table
              data={transactionsState.data}
              fetchData={fetchTransactions}
              loading={isLoading}
              total={transactionsState.pagination.total}
            />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default App;

const wrapper = css`
  min-height: 100%;
  display: flex;
  flex-direction: column;

  .footer {
    flex-shrink: 0;
    background-color: #ebebeb;
    height: 50px;
  }
`;

const container = css`
  padding: 40px 40px 0px 40px;
  height: 100%;
  flex: 1;
`;
