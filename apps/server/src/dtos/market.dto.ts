import z from 'zod';

export const KlineTopic = z.enum(['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'TONUSDT']);

export type TKlineTopic = z.infer<typeof KlineTopic>;

export const candlestickSchema = z.object({
  start: z.number(),
  end: z.number(),
  interval: z.string(),
  open: z.string(),
  close: z.string(),
  high: z.string(),
  low: z.string(),
  volume: z.string(),
  turnover: z.string(),
  confirm: z.boolean(),
  timestamp: z.number(),
});

export type CandlestickDto = z.infer<typeof candlestickSchema>;

export const bybitResponseSchema = z.object({
  topic: z.string(),
  data: z.array(candlestickSchema),
  ts: z.number(),
  type: z.string(),
  wsKey: z.string(),
});

export type BybitResponseDto = z.infer<typeof bybitResponseSchema>;

export const candlestickResponseSchema = z.object({
  open: z.number(),
  close: z.number(),
  high: z.number(),
  low: z.number(),
  time: z.number(),
});
export const candlesticksResponseSchema = z.array(candlestickResponseSchema);

export type CandlestickResponseDto = z.infer<typeof candlestickResponseSchema>;
export type CandlesticksResponseDto = z.infer<typeof candlesticksResponseSchema>;

export const klineMessageSchema = z.object({
  op: z.enum(['subscribe']),
  args: z.array(KlineTopic),
});

export type SubcribeKlineTopicDto = z.infer<typeof klineMessageSchema>;
