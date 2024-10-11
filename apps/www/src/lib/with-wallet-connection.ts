import { get } from "svelte/store";
import { tonConnect, isConnected } from "./stores/ton-connect";

export function withWalletConnection(callbackfn: () => void) {
  const _tonConnect = get(tonConnect);
  const _isConnected = get(isConnected);

  if (_isConnected) {
    callbackfn();
  } else {
    _tonConnect.connectWallet();
  }
}
