import 'antd/dist/antd.css';
import { css } from 'emotion';
import React from 'react';
import { TransactionsList } from './components/transactions-list';

const Footer = () => <footer className="footer" />;

function App() {
  return (
    <div className={wrapper}>
      <div className={container}>
        <main>
          <TransactionsList />
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
