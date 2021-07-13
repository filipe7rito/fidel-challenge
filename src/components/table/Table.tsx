import { ReloadOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { css } from 'emotion';
import React, { useMemo } from 'react';
import { Column, useTable, UseTableCellProps } from 'react-table';
import { Scheme, Transaction } from '../../api/transactions-api/types';
import { MasterCardImage, VisaImage } from '../../images';

export function Table({
  data,
  total,
  loading,
  fetchData,
  reload,
}: {
  data: Transaction[];
  total: number;
  loading: boolean;
  fetchData: () => void;
  reload: () => void;
}) {
  const columns: Column<Transaction>[] = useMemo(() => {
    return [
      {
        Header: 'Amount',
        id: 'amount',
        accessor: 'amount',
        maxWidth: 400,
        width: 140,
        /*  width: 200, */
        Cell: function Cell(options: UseTableCellProps<Transaction>) {
          const { row } = options;
          const { original: transaction } = row;

          return (
            <div>
              {transaction.currency} <strong>{transaction.amount.toFixed(2)}</strong>
            </div>
          );
        },
      },
      {
        Header: 'Address',
        id: 'address',
        maxWidth: 400,
        minWidth: 140,
        width: 140,
        accessor: (record: Transaction) => {
          return record.location.address;
        },
      },
      {
        Header: 'Scheme',
        id: 'scheme',
        maxWidth: 400,
        minWidth: 140,
        width: 140,
        accessor: (record: Transaction) => {
          return record.card.scheme;
        },
        Cell: function Cell(options: UseTableCellProps<Transaction>) {
          const { value } = options;

          return (
            <div /* style={{ textAlign: 'center' }} */>
              {value === Scheme.VISA ? <VisaImage /> : <MasterCardImage />}
            </div>
          );
        },
      },
      {
        Header: 'Card',
        id: 'card',
        maxWidth: 400,
        minWidth: 140,
        width: 140,
        accessor: (record: Transaction) => {
          return record.card.lastNumbers;
        },
      },
      {
        Header: 'Date(UTC)',
        id: 'datetime',
        maxWidth: 400,
        minWidth: 140,
        width: 140,
        accessor: (record: Transaction) => {
          const { datetime } = record;

          dayjs.extend(localizedFormat);

          return <>{dayjs(datetime).format('lll')}</>;
        },
      },
      {
        id: 'reload',
        width: 30,
        Header: () => {
          return (
            <ReloadOutlined
              onClick={() => reload()}
              className={css`
                cursor: pointer;
              `}
            />
          );
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
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  return (
                    <th
                      className={tableHeaderStyle}
                      {...column.getHeaderProps({
                        style: { minWidth: column.minWidth, width: column.width },
                      })}
                    >
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
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps({
                          style: {
                            minWidth: cell.column.minWidth,
                            width: cell.column.width,
                          },
                        })}
                      >
                        {cell.render('Cell')}
                      </td>
                    );
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

  table thead,
  table tbody tr {
    display: table;
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
    height: 70vh;
    overflow-y: scroll;
    border-bottom: 1px solid rgb(235, 236, 240);
  }

  .ant-spin-nested-loading > div > .ant-spin {
    position: unset;
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
  padding: 10px 0px;
  bottom: 0px;
  background: white;
`;
