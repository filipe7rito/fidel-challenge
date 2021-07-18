/* eslint-disable import/extensions */
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { transactions } from '../../test/fixtures/transactions';
import { Scheme } from '../../types/transaction';
import { TransactionsList } from './TransactionsList';
import { server } from '../../test/mocks/server';
import { rest } from 'msw';
import { baseUrl } from '../../test/mocks/handlers';

describe('Transactions', () => {
  it('Render transactions list with results', async () => {
    const { getByTestId } = renderTransactions();

    await waitFor(() => {
      // First row in table
      expect(getByTestId('table-row-0')).toBeInTheDocument();
    });
  });

  it('Filters table on search', async () => {
    const { getByTestId, getByPlaceholderText, getAllByRole } = renderTransactions();

    await waitFor(() => {
      // First row in table
      getByTestId('table-row-0');
    });

    const searchInput = getByPlaceholderText(/filter table results/i);
    userEvent.type(searchInput, Scheme.VISA);

    expect(getAllByRole('row').length - 1).toEqual(
      transactions.filter((transaction) => transaction.card.scheme === Scheme.VISA).length,
    );
  });

  it('Fetch more transaction on scroll bottom', async () => {
    const { getByTestId, getAllByRole } = renderTransactions();

    await waitFor(() => {
      // First row in table
      getByTestId('table-row-0');
    });

    const tableBody = getByTestId('table-body');
    const lastRow = getByTestId(`table-row-${transactions.length - 1}`);

    // Scroll to lastRow
    fireEvent.scroll(tableBody, lastRow);

    await waitFor(() => {
      // Header row plus body rows
      expect(getAllByRole('row').length).toEqual(41);
      expect(getByTestId('table-row-26')).toBeInTheDocument();
    });
  });

  it('Reloads data to default', async () => {
    const { getByTestId } = renderTransactions();

    await waitFor(() => {
      // First row in table
      getByTestId('table-row-0');
    });

    const reloadButton = getByTestId('reload-button');

    fireEvent.click(reloadButton);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      // First row in table
      getByTestId('table-row-0');
    });

    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it('Shows transaction preview drawer', async () => {
    const { getByTestId } = renderTransactions();

    await waitFor(() => {
      // First row in table
      getByTestId('table-row-0');
    });

    const firstTransaction = getByTestId('table-row-0');

    const transactionPreview = getByTestId('transaction-preview');

    expect(transactionPreview.classList.contains('ant-drawer-open')).toBe(false);

    userEvent.click(firstTransaction);

    expect(transactionPreview.classList.contains('ant-drawer-open')).toBe(true);

    const closePreviewButton = within(transactionPreview).getByLabelText('Close');

    userEvent.click(closePreviewButton);

    expect(transactionPreview.classList.contains('ant-drawer-open')).toBe(false);
  });

  it('Shows error when fetching data', async () => {
    renderTransactions();
    const { REACT_APP_FIDEL_PROGRAM_ID } = process.env;

    server.use(
      rest.get(
        `${baseUrl}/programs/${REACT_APP_FIDEL_PROGRAM_ID}/transactions`,
        (_req, res, ctx) => {
          return res(ctx.status(500));
        },
      ),
    );

    await waitFor(() => {
      expect(screen.getByText(/An error has ocurred/i)).toBeVisible();
    });
  });

  function renderTransactions() {
    return render(<TransactionsList />);
  }
});
