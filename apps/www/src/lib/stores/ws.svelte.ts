import { browser } from '$app/environment';
import { PUBLIC_API_URL } from '$env/static/public';
import type { UTCTimestamp } from 'lightweight-charts';
import { writable } from 'svelte/store';
import { timeToLocal } from '../utils';

const WS_DISCONNECT_RETRY_INTERVAL = 1000;

type Ws = {
  send: WebSocket['send'];
  close: WebSocket['close'];
  addEventListener: WebSocket['addEventListener'];
  reconnect: () => void;
  isConnected: boolean;
  isError: boolean;
  currentMessage: WsMessage | null;
};

const initialState: Ws = {
  send: () => {
    console.error('WebSocket connection not established');
  },
  close: () => {
    console.error('WebSocket connection not established');
  },
  addEventListener: () => {
    console.error('WebSocket connection not established');
  },
  reconnect: () => {
    console.error('WebSocket connection not established');
  },
  isConnected: false,
  isError: false,
  currentMessage: null
};

export const ws = writable(initialState, (set) => {
  if (!browser) {
    return;
  }

  let ws: WebSocket | null = $state(null);

  let isConnected = $state(false);
  let isError = $state(false);
  let lastMessage: WsMessage | null = $state(null);

  function update() {
    if (!browser) {
      return;
    }

    ws = new WebSocket(
      `${PUBLIC_API_URL.replace('https', 'wss')}/api/kline`
    );

    ws?.addEventListener('open', () => {
      isConnected = true;
    });

    ws?.addEventListener('message', (event) => {
      const message = JSON.parse(event.data) as WsMessage;
      message.data.time = timeToLocal(message.data.time as number) as UTCTimestamp;
      lastMessage = message;

      latestPrices.update((prices) => {
        prices[message.topic] = message.data.close;
        return prices;
      });
    });

    ws?.addEventListener('close', (e) => {
      console.log(`WebSocket connection closed with code: ${e.code} and reason: ${e.reason}`);
      set(initialState);
    });

    ws.addEventListener('error', (e) => {
      console.error('WebSocket error:', e);
      isError = true;
      set(initialState);
    });

    set({
      send: ws.send.bind(ws),
      close: ws.close.bind(ws),
      addEventListener: ws.addEventListener.bind(ws),
      reconnect: update,
      get isConnected() {
        return isConnected;
      },
      get isError() {
        return isError;
      },
      get currentMessage() {
        return lastMessage;
      }
    });
  }

  function cleanup() {
    if (ws?.bufferedAmount === 0) {
      ws?.close(1000, 'User closed the connection');
    } else {
      setTimeout(cleanup, WS_DISCONNECT_RETRY_INTERVAL);
    }
  }

  update();

  return cleanup;
});

export enum KlineTopic {
  BTCUSDT = 'BTCUSDT',
  ETHUSDT = 'ETHUSDT',
  SOLUSDT = 'SOLUSDT',
  TONUSDT = 'TONUSDT',
  BNBUSDT = 'BNBUSDT'
}

export type WsMessage = {
  topic: KlineTopic;
  data: {
    open: number;
    close: number;
    high: number;
    low: number;
    time: UTCTimestamp;
  };
};

export const latestPrices = writable<Record<KlineTopic, number>>({
  [KlineTopic.BTCUSDT]: 0,
  [KlineTopic.ETHUSDT]: 0,
  [KlineTopic.SOLUSDT]: 0,
  [KlineTopic.TONUSDT]: 0,
  [KlineTopic.BNBUSDT]: 0
});
