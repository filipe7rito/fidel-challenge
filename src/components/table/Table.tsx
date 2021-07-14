import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, Spin } from 'antd';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { css } from 'emotion';
import React, { useEffect, useMemo, useState } from 'react';
import { Column, useGlobalFilter, useTable, UseTableCellProps } from 'react-table';
import { Scheme, Transaction } from '../../api/transactions-api/types';
import { MasterCardImage, VisaImage } from '../../images';

export function Table({
  data,
  total,
  loading,
  fetchData,
  reload,
  onRowSelect,
}: {
  data: Transaction[];
  total: number;
  loading: boolean;
  fetchData: () => void;
  reload: () => void;
  onRowSelect: (transaction: Transaction) => void;
}) {
  const [filter, setFilter] = useState('');

  const columns: Column<Transaction>[] = useMemo(() => {
    return [
      {
        Header: 'Amount',
        id: 'amount',
        accessor: 'amount',
        maxWidth: 400,
        width: 140,
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

          return value === Scheme.VISA ? <VisaImage /> : <MasterCardImage />;
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

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
  );

  const { headerGroups, rows, prepareRow, setGlobalFilter } = tableInstance;

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    const hasReachedBottom = scrollHeight - scrollTop === clientHeight;

    if (hasReachedBottom) {
      fetchData();
    }
  };

  useEffect(() => {
    setGlobalFilter(filter);
  }, [filter, setGlobalFilter, data]);

  return (
    <div className={wrapperStyle}>
      <Input
        className={searchStyle}
        value={filter}
        placeholder="Filter table results"
        allowClear
        prefix={<SearchOutlined />}
        onChange={(e) => setFilter(e.target.value)}
      />

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
          <tbody onScroll={handleScroll}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} onClick={() => onRowSelect(row.original)}>
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
    width: 100%;
    table-layout: fixed;
    border-bottom: 1px solid rgb(235, 236, 240);
    min-height: 40px;
  }

  table tbody {
    display: block;
    height: 70vh;
    overflow-y: scroll;
    border-bottom: 1px solid rgb(235, 236, 240);
    cursor: pointer;

    tr :hover {
      background-color: rgb(248, 248, 248);
    }
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

const searchStyle = css`
  width: 280px;
  margin-bottom: 6px;
`;
