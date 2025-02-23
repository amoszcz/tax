export interface ClosedPosition {
  "Position ID": string;
  Action: string;
  "Long / Short": string;
  Amount: number;
  "Units / Contracts": string; //Units / Contracts
  Units?: string; //Units / Contracts
  "Open Date": "27/06/2024 00:06:38";
  "Close Date": "30/09/2024 00:06:49";
  Leverage: string;
  "Spread Fees (USD)": string | null;
  "Market Spread (USD)": string;
  "Profit(USD)": number;
  "FX rate at open (USD)": string;
  "FX rate at close (USD)": string;
  "Open Rate": number;
  "Close Rate": number;
  "Take profit rate": number;
  "Stop loss rate": string | null;
  "Overnight Fees and Dividends": number;
  "Copied From": string;
  Type: string;
  ISIN: string;
  Notes: null;
}

export interface Dividend {
  "Date of Payment": string;
  "Instrument Name": string;
  "Net Dividend Received (USD)": number;
  "Withholding Tax Rate (%)": string;
  "Withholding Tax Amount (USD)": number;
  "Position ID": string;
  Type: string;
  ISIN: string;
}

export interface AccountActivity {
  Date: string;
  Type:
    | "Rollover Fee"
    | "Dividend"
    | "Position closed"
    | "Start Copy"
    | "Open Position"
    | "Mirror balance to account";
  Details: string;
  Amount: number;
  Units: string;
  "Realized Equity Change": number;
  "Realized Equity": number;
  Balance: number;
  "Position ID": string;
  "Asset type": string;
  NWA: null;
}
