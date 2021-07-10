import React from 'react';
import { css } from 'emotion';

function App() {
  const thing = 'world';

  return <div className={style}>{`Hello ${thing}`}</div>;
}

export default App;

const style = css`
  color: royalblue;
`;
