import { rest } from 'msw';
import * as totalsResponse from '../fixtures/totals.json';
// eslint-disable-next-line import/extensions
import { last, transactions } from '../fixtures/transactions';

export const baseUrl = `https://api-dev.fidel.uk/v1d`;
const { REACT_APP_FIDEL_PROGRAM_ID } = process.env;

export const handlers = [
  rest.get(`${baseUrl}/programs/${REACT_APP_FIDEL_PROGRAM_ID}/transactions`, (req, res, ctx) => {
    const query = req.url.searchParams;
    const select = query.get('select');

    return select ? res(ctx.json(totalsResponse)) : res(ctx.json({ items: transactions, last }));
  }),
];
