export interface Options {
  name_assets: string;
  name_equity: string;
  name_expenses: string;
  name_income: string;
  name_liabilities: string;
}

export interface LedgerMeta {
  accounts: string[];
  currencies: string[];
  errors: number;
  options: Options;
}

export interface LedgerMetaResponse {
  data: LedgerMeta;
  success: boolean;
}
