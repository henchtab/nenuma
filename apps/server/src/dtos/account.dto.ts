import type { Address } from "@ton/ton";
import type { CashOrNothingOptionAgreement } from "nenuma-contracts";

export type TransactionList = {
  transactions: Transaction[];
  address_book: AddressBook;
};

type Transaction = {
  account: string;
  hash: string;
  lt: string;
  now: number;
  orig_status: "uninit" | "frozen" | "active" | "nonexist";
  end_status: "uninit" | "frozen" | "active" | "nonexist";
  total_fees: string;
  prev_trans_hash: string;
  prev_trans_lt: string;
  description: any;
  block_ref: BlockReference | null;
  in_msg: Message | null;
  out_msgs: Message[];
  account_state_before: AccountState | null;
  account_state_after: AccountState | null;
  mc_block_seqno: number | null;
};

type BlockReference = {
  // Define properties of BlockReference if needed
};

type Message = {
  hash: string;
  source: string | null;
  destination: string | null;
  value: string | null;
  fwd_fee: string | null;
  ihr_fee: string | null;
  created_lt: string | null;
  created_at: string | null;
  opcode: string | null;
  ihr_disabled: boolean | null;
  bounce: boolean | null;
  bounced: boolean | null;
  import_fee: string | null;
  message_content: MessageContent | null;
  init_state: MessageInitState | null;
};

type MessageContent = {
  hash: string;
  body: string;
  decoded: DecodedComment | null;
};

export type DecodedComment = TextComment | BinaryComment | null;

export type TextComment = {
  type: "text_comment";
  // Add additional properties specific to TextComment if any
};

export type BinaryComment = {
  type: "binary_comment";
  // Add additional properties specific to BinaryComment if any
};

type MessageInitState = {
  hash: string;
  body: string;
};

type AccountState = {
  // Define properties of AccountState if needed
};

type AddressBook = {
  [key: string]: {
    user_friendly: string;
  };
};

export enum OptionStatus {
  DEPLOYED = "deployed",
  INITIATED = "initiated",
  SETTLED = "settled",
  EXPIRED = "expired",
}

interface BaseOption {
  optionId: bigint;
}

// TODO: Use enum
export interface DeployedOption extends BaseOption {
  status: "deployed";
  address: Address;
  agreement: CashOrNothingOptionAgreement;
}

export interface InitiatedOption extends Omit<DeployedOption, "status"> {
  status: "initiated";
  strikePrice: number;
}

export interface SettledOption extends Omit<InitiatedOption, "status"> {
  status: "settled";
}

export interface ExpiredOption extends Omit<DeployedOption, "status"> {
  status: "expired";
}

export type Option = DeployedOption | InitiatedOption | SettledOption | ExpiredOption;
