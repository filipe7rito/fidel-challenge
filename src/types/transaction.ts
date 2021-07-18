export enum Scheme {
  VISA = 'visa',
  MASTERCARD = 'mastercard',
  AMEX = 'amex',
}
export type Transaction = {
  currency: string;
  programId: string;
  accountId: string;
  id: string;
  created: string;
  updated: string;
  amount: number;
  cleared: boolean;
  datetime: string;
  wallet: string | null;
  card: Card;
  location: Location;
  brand: Brand;
  identifiers: Identifiers;
};
export type Card = {
  id: string;
  lastNumbers: string;
  scheme: Scheme;
};
export type Location = {
  address: string;
  city: string;
  countryCode: string;
  id: string;
  geolocation: string | null;
  postcode: string;
  state: null;
  timezone: null;
  metadata: null;
};
export type Brand = {
  id: string;
  name: string | null;
  logoURL: string | null;
  metadata: string | null;
};

export type Identifiers = {
  amexApprovalCode: string | null;
  mastercardAuthCode: string | null;
  mastercardRefNumber: string | null;
  mastercardTransactionSequenceNumber: string | null;
  MID: string;
  visaAuthCode: string | null;
};

export type Last = {
  programIdDel: string;
  id: string;
  time: string;
};
