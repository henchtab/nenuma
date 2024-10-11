import { Address } from "@ton/ton";

class InvalidAddressError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidAddressError";
  }
}

const addressFormatOptions = {
  testOnly: true,
  bounceable: false,
};

function formatAddressString(
  addressString: string,
  prefixLength: number,
  suffixLength: number,
): string {
  return `${addressString.slice(0, prefixLength)}...${addressString.slice(-suffixLength)}`;
}

function getAddressString(address: string | Address): string {
  if (Address.isAddress(address)) {
    return address.toString(addressFormatOptions);
  }

  try {
    return Address.parse(address).toString(addressFormatOptions);
  } catch (error) {
    throw new InvalidAddressError(`${address} is not a valid address.`);
  }
}

export function shortenAddress(
  address: string | Address,
  prefixLength: number = 6,
  suffixLength: number = 6,
): string {
  const addressString = getAddressString(address);
  return formatAddressString(addressString, prefixLength, suffixLength);
}
