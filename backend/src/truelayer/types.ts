export interface ApiResponse<T> {
  results: T[];
  status: string;
}

interface AccountNumber {
  iban: string;
  swift_bic: string;
  number: string;
  sort_code: string;
}

interface Provider {
  display_name: string;
  provider_id: string;
  logo_uri: string;
}

export interface Account {
  update_timestamp: string;
  account_id: string;
  account_type: string;
  display_name: string;
  currency: string;
  account_number: AccountNumber;
  provider: Provider;
}

export interface Balance {
  currency: string;
  available: number;
  current: number;
  overdraft: number;
  update_timestamp: string;
}
