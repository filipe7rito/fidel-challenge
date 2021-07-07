# Fidel coding challenge

## What is Fidel API?

Fidel is an API platform that makes it easy for developers to link payment cards to their applications and receive real-time transaction data.

## Objective

The objective of this test is to verify your front-end skills and introduce you to the Fidel API.

## Task

1. Create a UI that displays transactions fetched from Fidel API (see below).
2. Add pagination using the pagination API (e.g. infinite scroll, load more button etc...)

### Stack

- JavaScript or TypeScript
- React

Please feel free to use your tooling of choice for styling and testing!

### Documentation

- [Documentation](https://docs.fidel.uk/transactions)
- [API Reference](https://reference.fidel.uk)
- [API pagination](https://reference.fidel.uk/reference#pagination)
  - If you are constructing the query parameter string yourself, you may need to use `encodeURIComponent` on the `start` parameter.

### API Access

Use the development stage API https://api-dev.fidel.uk/v1d/.  
- *Test environment secret key:* `sk_test_8b665908-284c-4dd1-a364-7ebc575c18f6`  
- *Program ID* to fetch the transactions from: `2314f371-39b1-4c80-8040-4144ff1bad09`  

You can read more about request headers in the API Reference.

## Questions & support

Should you have any questions, just ask jordan@fidel.uk :)
