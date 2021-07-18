import { render, waitFor } from '@testing-library/react';
import React from 'react';
import App from './App';
import 'intersection-observer';

describe('App', () => {
  it('Renders app', async () => {
    const { asFragment, getByTestId } = renderApp();

    await waitFor(() => {
      // First row in table
      getByTestId('table-row-0');
    });

    expect(asFragment()).toMatchSnapshot();
  });

  function renderApp() {
    return render(<App />);
  }
});
