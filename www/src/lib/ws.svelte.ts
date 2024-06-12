import { PUBLIC_API_URL } from '$env/static/public';
import { ACCESS_TOKEN_COOKIE } from '$lib';
import cookie from 'js-cookie';
import type { UTCTimestamp } from 'lightweight-charts';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const WS_DISCONNECT_RETRY_INTERVAL = 1000;

type Ws = {
  send: WebSocket['send'];
  close: WebSocket['close'];
  addEventListener: WebSocket['addEventListener'];
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
  currentMessage: null
};

export const ws = writable(initialState, (set) => {
  let lastMessage: WsMessage | null = $state(null);

  const ws = browser
    ? new WebSocket(
        `${PUBLIC_API_URL.replace('https', 'wss')}/api/kline?token=${cookie.get(ACCESS_TOKEN_COOKIE)}`
      )
    : null;

  const disconnect = () => {
    if (ws?.bufferedAmount === 0) {
      ws?.close(1000, 'User closed the connection');
    } else {
      setTimeout(disconnect, WS_DISCONNECT_RETRY_INTERVAL);
    }
  };

  ws?.addEventListener('message', (event) => {
    const message = JSON.parse(event.data) as WsMessage;
    lastMessage = message;

    latestPrices.update((prices) => {
      prices[message.topic] = message.data.close;
      return prices;
    });
  });

  ws?.addEventListener('close', () => {
    console.log('WebSocket connection closed');
    set(initialState);
  });

  if (ws) {
    set({
      send: ws.send.bind(ws),
      close: ws.close.bind(ws),
      addEventListener: ws.addEventListener.bind(ws),
      get currentMessage() {
        return lastMessage;
      }
    });
  }

  return () => {
    disconnect();
  };
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
