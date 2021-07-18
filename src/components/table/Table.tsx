import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, Spin } from 'antd';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { css } from 'emotion';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Column, useGlobalFilter, useTable, UseTableCellProps } from 'react-table';
import { MasterCardImage, VisaImage } from '../../images';
import { Scheme, Transaction } from '../../types/transaction';

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
        accessor: (record: Transaction) => {
          return record.amount.toFixed(2);
        },
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
        Cell: function Cell(options: UseTableCellProps<Transaction>) {
          const { value } = options;

          return value === Scheme.VISA ? <VisaImage /> : <MasterCardImage />;
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
      {
        id: 'reload',
        Header: () => {
          return (
            <ReloadOutlined
              data-testid="reload-button"
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

  const { state, headerGroups, rows, prepareRow, setGlobalFilter } = tableInstance;

  useEffect(() => {
    setGlobalFilter(filter);
  }, [filter, setGlobalFilter, data]);

  const renderCounter = () => {
    return (
      <div className={counterStyle}>{`Showing ${
        state.globalFilter ? rows.length : data.length
      } of ${total}`}</div>
    );
  };

  const observer = useRef<IntersectionObserver>();

  const lastRowReference = useCallback(
    (node: HTMLTableRowElement) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !filter) {
          fetchData();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading],
  );

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
        <table role="table">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  return (
                    <th {...column.getHeaderProps()}>
                      <div>{column.render('Header')}</div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody data-testid="table-body">
            {rows.map((row, index) => {
              prepareRow(row);

              const isLastRow = data.length === index + 1;

              return (
                <tr
                  {...row.getRowProps()}
                  ref={isLastRow ? lastRowReference : undefined}
                  data-testid={`table-row-${index}`}
                  onClick={() => onRowSelect(row.original)}
                >
                  {row.cells.map((cell) => {
                    return <td {...cell.getCellProps({})}>{cell.render('Cell')}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {renderCounter()}
      </Spin>
    </div>
  );
}

const wrapperStyle = css`
  table {
    width: 100%;
  }

  table tbody,
  table thead {
    display: block;
    border-bottom: 1px solid rgb(235, 236, 240);
  }

  thead tr th {
    line-height: 30px;
    text-align: left;
    font-size: 12px;
    color: rgb(108, 120, 139);
    padding: 8px 0px 8px 2px;
    font-weight: 400;
  }

  tbody {
    overflow-y: scroll;
    height: 70vh;

    tr {
      border-bottom: 1px solid rgb(235, 236, 240);
    }

    tr :hover {
      cursor: pointer;
      background-color: rgb(248, 248, 248);
    }
  }

  tbody td,
  thead th {
    line-height: 40px;
    width: 20%;
  }

  tbody td:last-child,
  thead th:last-child {
  }
  .ant-spin-nested-loading > div > .ant-spin {
    position: unset;
  }
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
