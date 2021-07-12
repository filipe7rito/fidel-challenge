import { Spin } from 'antd';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { css } from 'emotion';
import React, { useMemo } from 'react';
import { Column, useTable } from 'react-table';
import { Transaction } from '../../api/transactionsApi/types';

export function Table({
  data,
  total,
  loading,
  fetchData,
}: {
  data: Transaction[];
  total: number;
  loading: boolean;
  fetchData: () => void;
}) {
  const columns: Column<Transaction>[] = useMemo(() => {
    return [
      {
        Header: 'Amount',
        id: 'amount',
        accessor: 'amount',
      },
      {
        Header: 'Address',
        id: 'address',
        accessor: (record: Transaction) => {
          return record.location.address;
        },
      },
      {
        Header: 'Scheme',
        id: 'scheme',
        accessor: (record: Transaction) => {
          return record.card.scheme;
        },
      },
      {
        Header: 'Card',
        id: 'card',
        accessor: (record: Transaction) => {
          return record.card.lastNumbers;
        },
      },
      {
        Header: 'Date(UTC)',
        id: 'datetime',
        accessor: (record: Transaction) => {
          const { datetime } = record;

          dayjs.extend(localizedFormat);

          return <>{dayjs(datetime).format('lll')}</>;
        },
      },
    ];
  }, []);

  const tableInstance = useTable({
    columns,
    data,
  });

  const { headerGroups, rows, prepareRow } = tableInstance;

  return (
    <div className={wrapperStyle}>
      <Spin spinning={loading} tip="Loading...">
        <table>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.getHeaderGroupProps().key}>
                {headerGroup.headers.map((column) => {
                  return (
                    <th className={tableHeaderStyle} key={column.getHeaderProps().key}>
                      <div>{column.render('Header')}</div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody
            onScroll={(e: React.UIEvent<HTMLDivElement, UIEvent>) => {
              const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
              const hasReachedBottom = scrollHeight - scrollTop === clientHeight;

              if (hasReachedBottom) {
                fetchData();
              }
            }}
          >
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr key={row.getRowProps().key}>
                  {row.cells.map((cell) => {
                    return <td key={cell.getCellProps().key}>{cell.render('Cell')}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className={counterStyle}>{`Showing ${data.length} of ${total}`}</div>
      </Spin>
    </div>
  );
}

const wrapperStyle = css`
  overflow-y: hidden;
  width: 80%;

  table thead,
  table tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
    border-bottom: 1px solid rgb(235, 236, 240);
    min-height: 40px;
  }

  table th {
  }

  table tbody {
    display: block;
    min-height: 300px;
    height: 300px;
    overflow-y: scroll;
  }
`;

const tableHeaderStyle = css`
  text-align: left;
  font-size: 12px;
  color: rgb(108, 120, 139);
  padding: 8px 4px 8px 2px;
  font-weight: 400;
`;

const counterStyle = css`
  font-size: 12px;
  color: rgb(108, 120, 139);
  border-top: 1px solid rgb(235, 236, 240);
  padding: 10px 0px;
  bottom: 0px;
  background: white;
`;
