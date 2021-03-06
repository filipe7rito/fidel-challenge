import { Drawer, Spin } from 'antd';
import 'antd/dist/antd.css';
import { css } from 'emotion';
import React from 'react';
import ReactJson from 'react-json-view';
import { Transaction } from '../../types/transaction';

export function TransactionPreview({
  transaction,
  onClosePreview,
}: {
  transaction: Transaction | null;
  onClosePreview: () => void;
}) {
  return (
    <div className={drawerWrapperStyle}>
      <Drawer
        data-testid="transaction-preview"
        title="Transaction details"
        placement="right"
        onClose={() => onClosePreview()}
        visible={!!transaction}
        getContainer={false}
        style={{ position: 'absolute' }}
        width={570}
      >
        {transaction ? (
          <ReactJson src={transaction} theme="solarized" displayDataTypes={false} />
        ) : (
          <div className={spinnerStyle}>
            <Spin />
          </div>
        )}
      </Drawer>
    </div>
  );
}

const drawerWrapperStyle = css`
  .ant-drawer-content-wrapper {
    position: fixed;
  }

  .ant-drawer-header {
    padding: 40px;
    background: rgb(2, 43, 54);
    border-bottom: unset;
    .ant-drawer-title {
      font-size: 18px;
      line-height: 22px;
      color: white;
    }

    .ant-drawer-close {
      padding: 40px;
      color: white;
    }
  }

  .ant-drawer-body {
    background: rgb(2, 43, 54);
  }
`;

const spinnerStyle = css`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
