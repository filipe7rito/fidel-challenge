import 'antd/dist/antd.css';
import { css } from 'emotion';
import React from 'react';
import { TransactionsList } from './components/transactions-list';
import { FidelImage } from './images';

function App() {
  return (
    <div className={wrapper}>
      <main className={container}>
        <TransactionsList />
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className={footerStyle}>
      <FidelImage />
    </footer>
  );
}

export default App;

const wrapper = css`
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

const container = css`
  padding: 40px 40px 0px 40px;
  height: 100%;
  flex: 1;
`;

const footerStyle = css`
  flex-shrink: 0;
  background-color: #ebebeb;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
