import { Address, Contract, Transaction } from "@ton/core";
import { SandboxContract } from "@ton/sandbox";

export class ShrekLogger {
  private contractLabels: Map<string, string>;

  constructor() {
    this.contractLabels = new Map<string, string>();
  }

  addContract<F extends Contract>(
    contract: SandboxContract<F> | Address | string,
    label: string,
  ) {
    let address;

    if (typeof contract === "object" && "address" in contract) {
      address = (contract as SandboxContract<F>).address.toString();
    } else if (typeof contract === "string") {
      address = contract;
    } else {
      address = contract.toString();
    }

    if (this.contractLabels.get(address)) {
      throw new Error(
        `The '${address}' contract already has a '${label}' label!`,
      );
    }

    this.contractLabels.set(address, label);
  }

  getContractLabel(address?: string) {
    if (!address) {
      return "Shrek";
    }

    const label = this.contractLabels.get(address);

    if (!label) {
      return shortenString(address);
    }

    return label;
  }

  logTransactions(transactions: Transaction[], info?: string) {
    if (info) {
      console.info(info);
    }

    const formattedTransactions = transactions.map((tx) =>
      this.formatTransaction(tx)
    ).filter((v) => v !== undefined);

    console.table(formattedTransactions);
  }

  private formatTransaction(tx: Transaction) {
    if (tx.description.type !== "generic") {
      return undefined;
    }

    const body = tx.inMessage?.info.type === "internal"
      ? tx.inMessage.body?.beginParse()
      : undefined;
    const op = body && body.remainingBits >= 32
      ? body.preloadUint(32)
      : body
      ? "0xN0B0DY"
      : "0gR33n0gr";

    const totalFees = formatCoins(tx.totalFees.coins);
    const computeFees = tx.description.computePhase.type === "vm"
      ? formatCoins(tx.description.computePhase.gasFees)
      : undefined;
    const totalFwdFees = formatCoins(
      tx.description.actionPhase?.totalFwdFees,
    );
    const valueIn = tx.inMessage?.info.type === "internal"
      ? formatCoins(tx.inMessage.info.value.coins)
      : "The swamp keeps its secrets...";

    const valuesOut = tx.outMessages.values().length == 0
      ? ("0")
      : (tx.outMessages.values()
        .filter((message) => message.info.type === "internal")
        // @ts-ignore
        .map((message) => formatCoins(message.info.value.coins)));

    const forwardIn = tx.inMessage?.info.type === "internal"
      ? formatCoins(tx.inMessage.info.forwardFee)
      : undefined;

    let source = this.getContractLabel(
      tx.inMessage?.info.src?.toString(),
    );

    let destination = this.getContractLabel(
      tx.inMessage?.info.dest?.toString(),
    );

    return {
      "Source": source,
      "Destination": destination,
      "Type": tx.inMessage?.info.type,
      "Opcode": typeof op === "number" ? "0x" + op.toString(16) : op,
      "Incoming Value": valueIn,
      "Outgoing Value": valuesOut,
      "Total Fees": totalFees,
      "Outgoing Actions Count": tx.description.actionPhase?.totalActions ??
        "No actions here?",
      "Exit Code": tx.description.computePhase.type === "vm"
        ? tx.description.computePhase.exitCode
        : "Ogres have layers?",
      // actionCode: tx.description.actionPhase?.resultCode ?? "N/A",
    };
  }
}

// BEGIN HELPERS

function shortenString(str: string): string {
  if (str.length <= 8) {
    return str; // If the string is 8 characters or less, return it as is.
  }

  const firstPart = str.slice(0, 4); // Get the first 4 characters.
  const lastPart = str.slice(-4); // Get the last 4 characters.

  return `${firstPart}...${lastPart}`;
}

const decimalCount = 9;
const decimal = pow10(decimalCount);

function pow10(n: number): bigint {
  let v = 1n;
  for (let i = 0; i < n; i++) {
    v *= 10n;
  }
  return v;
}

function formatCoinsPure(value: bigint, precision = 6): string {
  let whole = value / decimal;

  let frac = value % decimal;
  const precisionDecimal = pow10(decimalCount - precision);
  if (frac % precisionDecimal > 0n) {
    // round up
    frac += precisionDecimal;
    if (frac >= decimal) {
      frac -= decimal;
      whole += 1n;
    }
  }
  frac /= precisionDecimal;

  return `${whole.toString()}${
    frac !== 0n
      ? "." + frac.toString().padStart(precision, "0").replace(/0+$/, "")
      : ""
  }`;
}

export function formatCoins(
  value: bigint | undefined | null,
  precision = 6,
): string {
  if (value === undefined || value === null) return "N/A";

  return formatCoinsPure(value, precision);
}

// END HELPERS
