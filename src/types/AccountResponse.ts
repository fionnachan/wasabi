export type AccountResponse = {
  address: string;
  amount: number;
  "amount-without-pending-rewards": number;
  "apps-local-state": AppLocalState[];
  "apps-total-schema": { "num-byte-slice": number; "num-uint": number };
  assets: AccountOwnedAsset[];
  "created-assets": AsaResponse[];
  "created-apps": CreatedApp[];
  participation: {
    "selection-participation-key": string | null;
    "vote-first-valid": number;
    "vote-key-dilution": number;
    "vote-last-valid": number;
    "vote-participation-key": string | null;
  };
  "pending-rewards": number;
  "reward-base": number;
  rewards: number;
  round: number;
  status: "Online" | "Offline";
  "sig-type"?: "sig" | "msig" | "lsig";
};

export type CreatedApp = {
  "created-at-round"?: number;
  deleted?: boolean;
  id: number;
  params?: {
    "approval-program": string;
    "clear-state-program": string;
    creator: string;
    "global-state-schema": StateSchema;
    "local-state-schema": StateSchema;
  };
};

export type StateSchema = {
  "num-byte-slice": number;
  "num-uint": number;
};

export type AccountOwnedAsset = {
  amount: number;
  "asset-id": number;
  creator: string;
  "is-frozen": boolean;
};

export type AsaResponse = {
  index: number;
  params: {
    clawback: string;
    creator: string;
    decimals: number;
    freeze: string;
    manager: string;
    name: string;
    reserve: string;
    total: number;
    "unit-name": string;
    url: string;
  };
};

export type AppLocalState = {
  deleted: boolean;
  id: number;
  "key-value": AppLocalStateKV[];
};

export type AppLocalStateKV = {
  key: string;
  value: {
    bytes: string;
    type: number;
    uint: number;
  };
};
