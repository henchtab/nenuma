import { B as current_component } from './index3-C3tkxEZ9.js';
import '@tonconnect/ui';
import { d as derived, r as readable, w as writable } from './index2-d8GdKNTl.js';
import './_sentry-release-injection-file-DnBzmPpn.js';

!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "d21d90b8-0c83-4985-abf7-ff052a9dbe6b", e._sentryDebugIdIdentifier = "sentry-dbid-d21d90b8-0c83-4985-abf7-ff052a9dbe6b");
  } catch (e2) {
  }
}();
function onDestroy(fn) {
  var context = (
    /** @type {import('#server').Component} */
    current_component
  );
  (context.d ??= []).push(fn);
}
async function tick() {
}
const tonConnectUI = readable(void 0, (set) => {
  return () => {
  };
});
const tonConnect = writable({
  sdk: null,
  connection: {
    status: "reconnecting",
    wallet: null
  },
  connectWallet: async () => {
  },
  disconnectWallet: async () => {
  }
});
const isReconnecting = derived(
  tonConnect,
  ($tonConnect) => $tonConnect.connection.status === "reconnecting"
);
const isConnected = derived(
  tonConnect,
  ($tonConnect) => $tonConnect.connection.status === "connected"
);
derived(
  tonConnect,
  ($tonConnect) => $tonConnect.connection.status === "disconnected"
);
const sender = derived(tonConnectUI, ($tonConnectUI) => {
  return {
    send: async (args) => {
      $tonConnectUI.sendTransaction({
        messages: [
          {
            address: args.to.toString(),
            amount: args.value.toString(),
            payload: args.body?.toBoc().toString("base64")
          }
        ],
        validUntil: Date.now() + 5 * 60 * 1e3
      });
    },
    connected: $tonConnectUI.connected
  };
});

export { isReconnecting as a, tick as b, tonConnectUI as c, isConnected as i, onDestroy as o, sender as s, tonConnect as t };
//# sourceMappingURL=ton-connect-Dy4dENFp.js.map
