import { render } from '@testing-library/react';
import React from 'react';
import App from './App';

describe('App', () => {
  test('Render app', () => {
    const { asFragment } = renderPersons();

    expect(asFragment()).toMatchSnapshot();
  });

  function renderPersons() {
    return render(<App />);
  }
});
