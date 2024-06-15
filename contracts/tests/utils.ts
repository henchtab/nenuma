import { Address, Contract, Transaction } from "@ton/core";
import { SandboxContract } from "@ton/sandbox";

export class ShrekLogger {
  private contractLabels: Map<string, string>;

  constructor() {
    this.contractLabels = new Map<string, string>();
  }

  /**
   * Adds a contract label for easy identification.
   * @param contract The contract or address to label.
   * @param label The label to associate with the contract.
   */
  addContract<F extends Contract>(
    contract: SandboxContract<F> | Address | string,
    label: string,
  ) {
    let address: string;

    // Determine the address string based on the type of the contract parameter.
    if (typeof contract === "object" && "address" in contract) {
      address = (contract as SandboxContract<F>).address.toString();
    } else if (typeof contract === "string") {
      address = contract;
    } else {
      address = contract.toString();
    }

    // Check for duplicate labels and throw an error if a label already exists.
    if (this.contractLabels.get(address) === address) {
      throw new Error(
        `The '${address}' contract already has a '${label}' label!`,
      );
    }

    // Set the label for the given address.
    this.contractLabels.set(address, label);
  }

  /**
   * Retrieves the label for a given contract address.
   * @param address The address of the contract.
   * @returns The label associated with the address or a shortened version of the address.
   */
  getContractLabel(address?: string): string {
    if (!address) {
      return "Shrek";
    }

    const label = this.contractLabels.get(address);

    if (!label) {
      return shortenString(address);
    }

    return label;
  }

  /**
   * Logs transactions to the console in a table format.
   * @param transactions The list of transactions to log.
   * @param info Optional info to log before the transactions.
   */
  logTransactions(transactions: Transaction[], info?: string) {
    if (info) {
      console.info(info);
    }

    const formattedTransactions = transactions.map((tx) =>
      this.formatTransaction(tx)
    ).filter((v) => v !== undefined);

    console.table(formattedTransactions);
  }

  /**
   * Formats a transaction into a readable object.
   * @param tx The transaction to format.
   * @returns A formatted transaction object or undefined if not applicable.
   */
  private formatTransaction(tx: Transaction) {
    if (tx.description.type !== "generic") {
      return undefined;
    }

    // Parse the transaction body if it is an internal message.
    const body = tx.inMessage?.info.type === "internal"
      ? tx.inMessage.body?.beginParse()
      : undefined;

    // Preload the operation code if available.
    const op = body && body.remainingBits >= 32
      ? body.preloadUint(32)
      : body
      ? "0xN0B0DY"
      : "0gR33n0gr";

    // Format the transaction fees and values.
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
      ? ("No coins!")
      : (tx.outMessages.values()
        .filter((message) => message.info.type === "internal")
        // @ts-ignore
        .map((message) => formatCoins(message.info.value.coins)));

    const forwardIn = tx.inMessage?.info.type === "internal"
      ? formatCoins(tx.inMessage.info.forwardFee)
      : undefined;

    // Get source and destination labels.
    let source = this.getContractLabel(
      tx.inMessage?.info.src?.toString(),
    );

    let destination = this.getContractLabel(
      tx.inMessage?.info.dest?.toString(),
    );

    // Return the formatted transaction object.
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

/**
 * Shortens a string to the first and last 4 characters, separated by ellipses.
 * @param str The string to shorten.
 * @returns The shortened string.
 */
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

/**
 * Calculates 10 raised to the power of n.
 * @param n The exponent.
 * @returns The value of 10^n as a bigint.
 */
function pow10(n: number): bigint {
  let v = 1n;
  for (let i = 0; i < n; i++) {
    v *= 10n;
  }
  return v;
}

/**
 * Formats a coin value to a readable string with a given precision.
 * @param value The coin value to format.
 * @param precision The number of decimal places to display.
 * @returns The formatted coin value as a string.
 */
function formatCoinsPure(value: bigint, precision = 6): string {
  let whole = value / decimal;

  let frac = value % decimal;
  const precisionDecimal = pow10(decimalCount - precision);
  if (frac % precisionDecimal > 0n) {
    // Round up the fractional part.
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

/**
 * Formats a coin value to a readable string, handling undefined or null values.
 * @param value The coin value to format.
 * @param precision The number of decimal places to display.
 * @returns The formatted coin value as a string or "N/A" if value is undefined or null.
 */
export function formatCoins(
  value: bigint | undefined | null,
  precision = 6,
): string {
  if (value === undefined || value === null) return "N/A";

  return formatCoinsPure(value, precision);
}

// END HELPERS
