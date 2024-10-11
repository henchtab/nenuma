import { RedisKey } from "@/constants";
import {
  KlineTopic,
  klineMessageSchema,
  type BybitResponseDto,
  type CandlestickDto,
  type CandlesticksResponseDto,
  type TKlineTopic,
} from "@/dtos/market.dto";
import type { WebSocket } from "@fastify/websocket";
import type { FastifyReply, FastifyRequest } from "fastify";

import { ZodError } from "zod";
import { MarketService } from "../services";

const isKlineOfInterest = (topic: string, data: BybitResponseDto) => data.topic === topic;

export const handleKlineTopic = async (
  request: FastifyRequest<{ Params: { topic: TKlineTopic } }>,
  reply: FastifyReply,
) => {
  const { redis } = request.server;
  const { topic } = request.params;

  let data: CandlestickDto[] = [];
  let latestCandlestick: CandlestickDto | null = null;
  let error: ZodError | undefined;

  switch (topic) {
    case KlineTopic.Enum.BTCUSDT:
      try {
        const result = await MarketService.parseKlineTopic(
          [RedisKey.KlineBTC24H, RedisKey.KlineBTC1m],
          redis,
        );

        data = result.confirmedCandlesticks;

        latestCandlestick = result.latestCandlestick;
      } catch (error) {
        if (error instanceof ZodError) {
          error = error;
        }
      }
      break;
    case KlineTopic.Enum.ETHUSDT:
      try {
        const result = await MarketService.parseKlineTopic(
          [RedisKey.KlineETH24H, RedisKey.KlineETH1m],
          redis,
        );

        data = result.confirmedCandlesticks;
        latestCandlestick = result.latestCandlestick;
      } catch (error) {
        if (error instanceof ZodError) {
          error = error;
        }
      }
      break;
    case KlineTopic.Enum.TONUSDT:
      try {
        const result = await MarketService.parseKlineTopic(
          [RedisKey.KlineTON24H, RedisKey.KlineTON1m],
          redis,
        );

        data = result.confirmedCandlesticks;
        latestCandlestick = result.latestCandlestick;
      } catch (error) {
        if (error instanceof ZodError) {
          error = error;
        }
      }
      break;
    case KlineTopic.Enum.SOLUSDT:
      try {
        const result = await MarketService.parseKlineTopic(
          [RedisKey.KlineSOL24H, RedisKey.KlineSOL1m],
          redis,
        );

        data = result.confirmedCandlesticks;
        latestCandlestick = result.latestCandlestick;
      } catch (error) {
        if (error instanceof ZodError) {
          error = error;
        }
      }
      break;
    case KlineTopic.Enum.BNBUSDT:
      try {
        const result = await MarketService.parseKlineTopic(
          [RedisKey.KlineBNB24H, RedisKey.KlineBNB1m],
          redis,
        );

        data = result.confirmedCandlesticks;
        latestCandlestick = result.latestCandlestick;
      } catch (error) {
        if (error instanceof ZodError) {
          error = error;
        }
      }
      break;
  }

  if (error) {
    return reply.status(400).send(error.errors);
  }

  const candlesticks: CandlesticksResponseDto = [];
  for (const candlestick of data) {
    candlesticks.push({
      open: Number(candlestick.open),
      close: Number(candlestick.close),
      high: Number(candlestick.high),
      low: Number(candlestick.low),
      time: Number(candlestick.end.toString().slice(0, -3)),
    });
  }

  return reply.code(200).send({
    list: candlesticks,
    latest: latestCandlestick
      ? {
          open: Number(latestCandlestick?.open),
          close: Number(latestCandlestick?.close),
          high: Number(latestCandlestick?.high),
          low: Number(latestCandlestick?.low),
          time: Number(latestCandlestick?.end.toString().slice(0, -3)),
        }
      : null,
  });
};

export const handleKlineTopicWS = async (socket: WebSocket, request: FastifyRequest) => {
  const { bybit } = request.server;

  socket.on("message", async (message) => {
    try {
      const data = klineMessageSchema.parse(JSON.parse(message.toString()));

      const topics = data.args;

      bybit.ws.on("update", (data: BybitResponseDto) => handleBybitResponse(socket, data, topics));
    } catch (error) {
      if (error instanceof ZodError) {
        socket.send(
          JSON.stringify({
            error: error.format(),
          }),
        );
        return;
      }

      // Handle parsing error
      if (error instanceof Error) {
        socket.send(
          JSON.stringify({
            error: "Invalid JSON payload",
          }),
        );
      }
    }
  });
};

const handleBybitResponse = (socket: WebSocket, data: BybitResponseDto, topics: TKlineTopic[]) => {
  for (const topic of topics) {
    if (isKlineOfInterest(`kline.1.${topic}`, data)) {
      for (const candlestick of data.data) {
        socket.send(
          JSON.stringify({
            topic: topic,
            data: {
              high: Number(candlestick.high),
              low: Number(candlestick.low),
              open: Number(candlestick.open),
              close: Number(candlestick.close),
              time: Number(candlestick.end.toString().slice(0, -3)),
            },
          }),
        );
      }
    }
  }
};
