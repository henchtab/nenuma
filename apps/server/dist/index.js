var Dt =
  typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
Dt.SENTRY_RELEASE = { id: "ee94c61b4a58a13318bafa4c31f4fdccbe7c0610" };
(function () {
  try {
    var t =
        typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {},
      e = new Error().stack;
    e &&
      ((t._sentryDebugIds = t._sentryDebugIds || {}),
      (t._sentryDebugIds[e] = "3fdf248b-3ee7-4b25-bfad-064cdf289677"),
      (t._sentryDebugIdIdentifier = "sentry-dbid-3fdf248b-3ee7-4b25-bfad-064cdf289677"));
  } catch {}
})();
import * as W from "@sentry/node";
W.init({
  dsn: "https://b7e96e60dc1578f4479e5ebfa3a868a1@o4504770823061504.ingest.us.sentry.io/4507624025948160",
});
import Te from "@fastify/cors";
import we from "@fastify/helmet";
import Fe from "@fastify/jwt";
import ke from "@fastify/redis";
import Ae from "@fastify/swagger";
import Oe from "@fastify/websocket";
import Re from "@scalar/fastify-api-reference";
import Pe from "fastify";
import { serializerCompiler as Ie, validatorCompiler as _e } from "fastify-type-provider-zod";
import { DefaultLogger as Et, WebsocketClient as Tt } from "bybit-api";
import wt from "fastify-plugin";
var Ft = async (t) => {
    let e = { ...Et, silly: (...r) => console.log("silly", ...r) },
      n = new Tt({ market: "v5" });
    t.addHook("onClose", async () => {
      n.closeAll();
    }),
      t.decorate("bybit", { ws: n });
  },
  x = wt(Ft);
import { Address as kt } from "@ton/ton";
import "dotenv/config";
import At from "fastify-plugin";
import y from "zod";
var J = ((r) => (
    (r.development = "development"), (r.test = "test"), (r.production = "production"), r
  ))(J || {}),
  Ot = y.object({
    NODE_ENV: y.nativeEnum(J),
    LOG_LEVEL: y.string(),
    API_HOST: y.string(),
    API_PORT: y.string(),
    REDIS_URI: y.string(),
    REDIS_HOST: y.string(),
    REDIS_PORT: y.coerce.number(),
    REDIS_PASSWORD: y.string(),
    REDIS_USER: y.string(),
    COOKIE_SECRET: y.string(),
    JWT_SECRET: y.string(),
    RPC_PROVIDER_API_KEY: y.string(),
    DATA_STREAM_ADDRESS: y.string(),
    BTC_BROKER_ADDRESS: y.string().transform((t) => kt.parse(t)),
    MNEMONIC: y.string(),
  }),
  Rt = async (t) => {
    let e = Ot.safeParse(process.env);
    if (!e.success)
      throw new Error(".env file validation failed - " + JSON.stringify(e.error, null, 2));
    t.decorate("config", e.data);
  },
  U = At(Rt);
var R = ((n) => ((n.MAINNET = "-239"), (n.TESTNET = "-3"), n))(R || {});
import a from "zod";
var T = a.enum(["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "TONUSDT"]),
  K = a.object({
    start: a.number(),
    end: a.number(),
    interval: a.string(),
    open: a.string(),
    close: a.string(),
    high: a.string(),
    low: a.string(),
    volume: a.string(),
    turnover: a.string(),
    confirm: a.boolean(),
    timestamp: a.number(),
  }),
  eo = a.object({
    topic: a.string(),
    data: a.array(K),
    ts: a.number(),
    type: a.string(),
    wsKey: a.string(),
  }),
  It = a.object({
    open: a.number(),
    close: a.number(),
    high: a.number(),
    low: a.number(),
    time: a.number(),
  }),
  oo = a.array(It),
  V = a.object({ op: a.enum(["subscribe"]), args: a.array(T) });
import { ZodError as O } from "zod";
import { Address as j, TonClient4 as z } from "@ton/ton";
import { Buffer as _t } from "buffer";
var k = class t {
  static create(e) {
    return (
      e === "-239" && (e = new z({ endpoint: "https://mainnet-v4.tonhubapi.com" })),
      e === "-3" && (e = new z({ endpoint: "https://testnet-v4.tonhubapi.com" })),
      new t(e)
    );
  }
  client;
  constructor(e) {
    this.client = e;
  }
  async getWalletPublicKey(e) {
    let n = await this.client.getLastBlock(),
      r = await this.client.runMethod(n.last.seqno, j.parse(e), "get_public_key", []);
    return _t.from(r.reader.readBigNumber().toString(16).padStart(64, "0"), "hex");
  }
  async getAccountInfo(e) {
    let n = await this.client.getLastBlock();
    return await this.client.getAccount(n.last.seqno, j.parse(e));
  }
};
import {
  Cell as Nt,
  WalletContractV1R1 as Kt,
  WalletContractV1R2 as xt,
  WalletContractV1R3 as Ut,
  WalletContractV2R1 as Ht,
  WalletContractV2R2 as $t,
  WalletContractV3R1 as vt,
  WalletContractV3R2 as Lt,
  WalletContractV4 as Q,
  contractAddress as Mt,
} from "@ton/ton";
import { Buffer as X } from "buffer";
var $ = class {
    static create(e) {
      let n = Q.create(e),
        { data: r } = n.init,
        i = Nt.fromBoc(
          X.from(
            "B5EE9C72410215010002F5000114FF00F4A413F4BCF2C80B010201200203020148040504F8F28308D71820D31FD31FD31F02F823BBF263ED44D0D31FD31FD3FFF404D15143BAF2A15151BAF2A205F901541064F910F2A3F80024A4C8CB1F5240CB1F5230CBFF5210F400C9ED54F80F01D30721C0009F6C519320D74A96D307D402FB00E830E021C001E30021C002E30001C0039130E30D03A4C8CB1F12CB1FCBFF1112131403EED001D0D3030171B0915BE021D749C120915BE001D31F218210706C7567BD228210626C6E63BDB022821064737472BDB0925F03E002FA403020FA4401C8CA07CBFFC9D0ED44D0810140D721F404305C810108F40A6FA131B3925F05E004D33FC8258210706C7567BA9131E30D248210626C6E63BAE30004060708020120090A005001FA00F404308210706C7567831EB17080185005CB0527CF165003FA02F40012CB69CB1F5210CB3F0052F8276F228210626C6E63831EB17080185005CB0527CF1624FA0214CB6A13CB1F5230CB3F01FA02F4000092821064737472BA8E3504810108F45930ED44D0810140D720C801CF16F400C9ED54821064737472831EB17080185004CB0558CF1622FA0212CB6ACB1FCB3F9410345F04E2C98040FB000201200B0C0059BD242B6F6A2684080A06B90FA0218470D4080847A4937D29910CE6903E9FF9837812801B7810148987159F31840201580D0E0011B8C97ED44D0D70B1F8003DB29DFB513420405035C87D010C00B23281F2FFF274006040423D029BE84C600201200F100019ADCE76A26840206B90EB85FFC00019AF1DF6A26840106B90EB858FC0006ED207FA00D4D422F90005C8CA0715CBFFC9D077748018C8CB05CB0222CF165005FA0214CB6B12CCCCC971FB00C84014810108F451F2A702006C810108D718C8542025810108F451F2A782106E6F746570748018C8CB05CB025004CF16821005F5E100FA0213CB6A12CB1FC971FB00020072810108D718305202810108F459F2A7F82582106473747270748018C8CB05CB025005CF16821005F5E100FA0214CB6A13CB1F12CB3FC973FB00000AF400C9ED5446A9F34F",
            "hex",
          ),
        )[0];
      return (n.init = { data: r, code: i }), (n.address = Mt(e.workchain, n.init)), n;
    }
  },
  qt = [
    { contract: Kt, loadData: H },
    { contract: xt, loadData: H },
    { contract: Ut, loadData: H },
    { contract: Ht, loadData: G },
    { contract: $t, loadData: G },
    { contract: vt, loadData: Y },
    { contract: Lt, loadData: Y },
    { contract: $, loadData: Z },
    { contract: Q, loadData: Z },
  ].map(({ contract: t, loadData: e }) => ({
    contract: t,
    loadData: e,
    wallet: t.create({ workchain: 0, publicKey: X.alloc(32) }),
  }));
function H(t) {
  let e = t.loadUint(32),
    n = t.loadBuffer(32);
  return { seqno: e, publicKey: n };
}
function G(t) {
  let e = t.loadUint(32),
    n = t.loadBuffer(32);
  return { seqno: e, publicKey: n };
}
function Y(t) {
  let e = t.loadUint(32),
    n = t.loadUint(32),
    r = t.loadBuffer(32);
  return { seqno: e, publicKey: r, walletId: n };
}
function Z(t) {
  let e = t.loadUint(32),
    n = t.loadUint(32),
    r = t.loadBuffer(32),
    i = t.loadMaybeRef();
  return { seqno: e, publicKey: r, walletId: n, plugins: i };
}
function tt(t) {
  if (!t.code || !t.data) return null;
  for (let { wallet: e, loadData: n } of qt)
    try {
      if (e.init.code.equals(t.code)) return n(t.data.beginParse()).publicKey;
    } catch {}
  return null;
}
import { sha256 as et } from "@ton/crypto";
import { Address as Wt, Cell as Jt, contractAddress as Vt, loadStateInit as jt } from "@ton/ton";
import { Buffer as h } from "node:buffer";
import ot from "tweetnacl";
var zt = "ton-proof-item-v2/",
  Gt = "ton-connect",
  Yt = 15 * 60,
  A = class {
    generatePayload() {
      return h.from(ot.randomBytes(32)).toString("hex");
    }
    async checkProof(e, n) {
      try {
        let r = jt(Jt.fromBase64(e.proof.state_init).beginParse()),
          i = tt(r) ?? (await n(e.address));
        if (!i) return !1;
        let l = h.from(e.public_key, "hex");
        if (!i.equals(l)) return !1;
        let g = Wt.parse(e.address),
          s = Vt(g.workChain, r);
        if (!s.equals(g) || Math.floor(Date.now() / 1e3) - Yt > e.proof.timestamp) return !1;
        let p = {
            workchain: s.workChain,
            address: s.hash,
            domain: { lengthBytes: e.proof.domain.lengthBytes, value: e.proof.domain.value },
            signature: h.from(e.proof.signature, "base64"),
            payload: e.proof.payload,
            stateInit: e.proof.state_init,
            timestamp: e.proof.timestamp,
          },
          f = h.alloc(4);
        f.writeUInt32BE(p.workchain, 0);
        let c = h.alloc(8);
        c.writeBigUInt64LE(BigInt(p.timestamp), 0);
        let u = h.alloc(4);
        u.writeUInt32LE(p.domain.lengthBytes, 0);
        let d = h.concat([
            h.from(zt),
            f,
            p.address,
            u,
            h.from(p.domain.value),
            c,
            h.from(p.payload),
          ]),
          C = h.from(await et(d)),
          S = h.concat([h.from([255, 255]), h.from(Gt), C]),
          F = h.from(await et(S));
        return ot.sign.detached.verify(F, p.signature, i);
      } catch {
        return !1;
      }
    }
  };
import Zt from "zod";
var w = class {
  static async parseKlineTopic(e, n) {
    let r = n.pipeline();
    r.lrange(e[0], 0, -1), r.get(e[1]);
    let i = await r.exec();
    if (!i) throw new Error("Failed to fetch data from Redis");
    let l = (i[0]?.[1]).map((p) => JSON.parse(p)),
      g = JSON.parse(i[1]?.[1]),
      s = Zt.array(K).safeParse(l),
      o = K.safeParse(g);
    if (!s.success || !o.success) throw s.error || o.error;
    return { confirmedCandlesticks: s.data, latestCandlestick: o.data };
  }
};
var Qt = (t, e) => e.topic === t,
  rt = async (t, e) => {
    let { redis: n } = t.server,
      { topic: r } = t.params,
      i = [],
      l = null,
      g;
    switch (r) {
      case T.Enum.BTCUSDT:
        try {
          let o = await w.parseKlineTopic(["kline:BTC:24h", "kline:BTC:1m"], n);
          (i = o.confirmedCandlesticks), (l = o.latestCandlestick);
        } catch (o) {
          o instanceof O && (o = o);
        }
        break;
      case T.Enum.ETHUSDT:
        try {
          let o = await w.parseKlineTopic(["kline:ETH:24h", "kline:ETH:1m"], n);
          (i = o.confirmedCandlesticks), (l = o.latestCandlestick);
        } catch (o) {
          o instanceof O && (o = o);
        }
        break;
      case T.Enum.TONUSDT:
        try {
          let o = await w.parseKlineTopic(["kline:TON:24h", "kline:TON:1m"], n);
          (i = o.confirmedCandlesticks), (l = o.latestCandlestick);
        } catch (o) {
          o instanceof O && (o = o);
        }
        break;
      case T.Enum.SOLUSDT:
        try {
          let o = await w.parseKlineTopic(["kline:SOL:24h", "kline:SOL:1m"], n);
          (i = o.confirmedCandlesticks), (l = o.latestCandlestick);
        } catch (o) {
          o instanceof O && (o = o);
        }
        break;
      case T.Enum.BNBUSDT:
        try {
          let o = await w.parseKlineTopic(["kline:BNB:24h", "kline:BNB:1m"], n);
          (i = o.confirmedCandlesticks), (l = o.latestCandlestick);
        } catch (o) {
          o instanceof O && (o = o);
        }
        break;
    }
    if (g) return e.status(400).send(g.errors);
    let s = [];
    for (let o of i)
      s.push({
        open: Number(o.open),
        close: Number(o.close),
        high: Number(o.high),
        low: Number(o.low),
        time: Number(o.end.toString().slice(0, -3)),
      });
    return e
      .code(200)
      .send({
        list: s,
        latest: l
          ? {
              open: Number(l?.open),
              close: Number(l?.close),
              high: Number(l?.high),
              low: Number(l?.low),
              time: Number(l?.end.toString().slice(0, -3)),
            }
          : null,
      });
  },
  st = async (t, e) => {
    let { bybit: n } = e.server;
    t.on("message", async (r) => {
      try {
        let l = V.parse(JSON.parse(r.toString())).args;
        n.ws.on("update", (g) => Xt(t, g, l));
      } catch (i) {
        if (i instanceof O) {
          t.send(JSON.stringify({ error: i.format() }));
          return;
        }
        i instanceof Error && t.send(JSON.stringify({ error: "Invalid JSON payload" }));
      }
    });
  },
  Xt = (t, e, n) => {
    for (let r of n)
      if (Qt(`kline.1.${r}`, e))
        for (let i of e.data)
          t.send(
            JSON.stringify({
              topic: r,
              data: {
                high: Number(i.high),
                low: Number(i.low),
                open: Number(i.open),
                close: Number(i.close),
                time: Number(i.end.toString().slice(0, -3)),
              },
            }),
          );
  };
import { mnemonicToPrivateKey as te } from "@ton/crypto";
import {
  Address as ee,
  TonClient as oe,
  WalletContractV4 as ne,
  beginCell as re,
  internal as se,
} from "@ton/ton";
import { DataStream as ie, storeDSTPublishCandlestick as ae } from "nenuma-contracts";
import v from "zod";
var ce = async (t) => {
    let { redis: e, bybit: n, log: r } = t;
    n.ws.subscribeV5("kline.1.BTCUSDT", "spot");
    let i = new oe({
        endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
        apiKey: t.config.RPC_PROVIDER_API_KEY,
      }),
      l = await te(t.config.MNEMONIC.split(",")),
      s = ne.create({ workchain: 0, publicKey: l.publicKey }),
      o = i.open(s),
      p = i.open(ie.fromAddress(ee.parse(t.config.DATA_STREAM_ADDRESS)));
    n.ws.on("update", async (f) => {
      switch (f.topic) {
        case "kline.1.BTCUSDT":
          for (let c of f.data)
            if (c.confirm) {
              e.pipeline()
                .rpush("kline:BTC:24h", JSON.stringify(c))
                .ltrim("kline:BTC:24h", -1440, -1)
                .exec();
              try {
                let u = await p.getBatches(),
                  d = !1;
                for (let [F, B] of u)
                  r.debug("Batch Info: %s", B.subscriptionsCount.toString()),
                    B.subscriptionsCount > 0 ? (d = !1) : (d = !0);
                if (d) return;
                let C = await o.getSeqno(),
                  S = {
                    $$type: "Candlestick",
                    open: BigInt(c.open.split(".").join("")),
                    high: BigInt(c.high.split(".").join("")),
                    low: BigInt(c.low.split(".").join("")),
                    close: BigInt(c.close.split(".").join("")),
                    start: BigInt(c.start.toString().slice(0, -3)),
                    end: BigInt(c.end.toString().slice(0, -3)) + 1n,
                  };
                r.debug(
                  "Publishing Candlestick: %s",
                  JSON.stringify(S, (F, B) => (typeof B == "bigint" ? B.toString() : B), 2),
                ),
                  await o.sendTransfer({
                    seqno: C,
                    secretKey: l.secretKey,
                    messages: [
                      se({
                        value: "5",
                        to: t.config.DATA_STREAM_ADDRESS,
                        body: re()
                          .store(
                            ae({ $$type: "DSTPublishCandlestick", queryId: 777n, candlestick: S }),
                          )
                          .endCell(),
                      }),
                    ],
                  });
              } catch (u) {
                r.error("Error: %s", u);
              }
            } else e.set("kline:BTC:1m", JSON.stringify(c));
          break;
      }
    }),
      t.get(
        "/kline/:topic",
        {
          schema: {
            params: v.object({ topic: T }),
            querystring: v.object({ token: v.string().optional() }).optional(),
          },
        },
        rt,
      ),
      t.get("/kline", { websocket: !0 }, st);
  },
  it = ce;
import b from "zod";
var at = b.object({
  address: b.string(),
  network: b.nativeEnum(R),
  public_key: b.string(),
  proof: b.object({
    timestamp: b.number(),
    domain: b.object({ lengthBytes: b.number(), value: b.string() }),
    payload: b.string(),
    signature: b.string(),
    state_init: b.string(),
  }),
});
import { fromNano as le } from "@ton/ton";
async function ct(t, e) {
  try {
    let n = k.create("-3");
    if (!(await new A().checkProof(t.body, (s) => n.getWalletPublicKey(s))))
      return e.code(400).send({ message: "Invalid proof" });
    if (!t.server.jwt.verify(t.body.proof.payload).toString())
      return e.code(400).send({ message: "Invalid token" });
    let g = await e.jwtSign(
      {
        address: t.body.address,
        network: t.body.network,
        name: "Vladimir Starkov",
        email: "test@gmail.com",
      },
      { expiresIn: "180d" },
    );
    return e.code(200).send({ message: "Proof is valid", token: g });
  } catch (n) {
    return console.error(n), e.code(400).send({ message: "Invalid request", error: n });
  }
}
async function lt(t, e) {
  try {
    let r = new A().generatePayload(),
      i = await e.jwtSign({ payload: r }, { expiresIn: "15m" });
    return e.code(200).send({ proofToken: i });
  } catch (n) {
    return console.error(n), e.code(400).send({ message: "Invalid request", error: n });
  }
}
async function dt(t, e) {
  try {
    let { address: n, network: r } = t.user,
      i = k.create(r),
      { account: l } = await i.getAccountInfo(n);
    return e.code(200).send({ address: n, balance: le(l.balance.coins) });
  } catch (n) {
    return console.error(n), e.code(400).send({ message: "Invalid request", error: n });
  }
}
var de = async (t) => {
    t.post("/check-proof", { schema: { body: at } }, ct),
      t.post("/generate-proof-payload", {}, lt),
      t.get(
        "/account-info",
        {
          preHandler: async (e, n) => {
            try {
              await e.jwtVerify();
            } catch (r) {
              n.send(r);
            }
          },
        },
        dt,
      );
  },
  pt = de;
import { Address as _, Cell as ft, TonClient4 as pe } from "@ton/ton";
import { Queue as mt, Worker as ut } from "bullmq";
import {
  CashOrNothingOption as fe,
  loadCashOrNothingOptionDeploy as me,
  loadStateInit as ue,
} from "nenuma-contracts";
import P from "zod";
import * as M from "@sentry/node";
var L = "brokers",
  yt = "options",
  ye = 3600n,
  gt = "https://testnet.toncenter.com/api/v3",
  ge = "0xc74f6284",
  Ce = "0x1800dc14",
  he = "0xff379604",
  Se = "0x50240b79",
  be = "Exit code: -256",
  I = (t, e) => (typeof e == "bigint" || e instanceof _ ? e.toString() : e),
  Be = (t, e) => {
    let n = ["optionId", "initiation", "expiration", "investment"],
      r = ["address", "holder", "writer"];
    return n.includes(t) && typeof e == "string"
      ? BigInt(e)
      : r.includes(t) && typeof e == "string"
        ? _.parse(e)
        : e;
  },
  De = async (t) => {
    let e = t.log,
      n = new mt(L, { connection: t.redis }),
      r = new mt(yt, { connection: t.redis });
    n.add(
      L,
      { address: t.config.BTC_BROKER_ADDRESS.toString() },
      { repeatJobKey: "btc-broker", repeat: { every: 5e3 } },
    );
    let i = new ut(
      L,
      async (s) => {
        let o = await t.redis.get("broker:BTC:start_utime"),
          p = new URLSearchParams();
        p.set("account", s.data.address),
          p.set("limit", "20"),
          p.set("offset", "0"),
          o &&
            (e.debug(`Fetching transactions for ${s.data.address} starting from ${o}`),
            p.set("start_utime", o));
        let f = await fetch(`${gt}/transactions?${p.toString()}`, {
          headers: { "X-API-KEY": t.config.RPC_PROVIDER_API_KEY },
        });
        if (!f.ok) {
          let d = await f.json();
          e.error(`Failed to get transactions for ${s.data.address}. Error: ${f.statusText}`),
            M.captureException(
              new Error(`Failed to get transactions for ${s.data.address}. Error: ${d}`),
            );
        }
        let { transactions: c } = await f.json(),
          u = c.flatMap((d) =>
            d.out_msgs
              .filter((C) => C?.opcode === ge)
              .map((C) => ({ ...C, utime: d.now }))
              .sort((C, S) => C.utime - S.utime),
          );
        u[0] && t.redis.set("broker:BTC:start_utime", u[0].utime.toString()),
          u.forEach(async (d) => {
            if (!d.init_state || !d.destination || !d.message_content) return;
            let C = ft.fromBase64(d.init_state.body).asSlice(),
              S = ue(C).data.beginParse();
            S.loadRef(), S.loadBit();
            let F = S.loadAddress(),
              B = S.loadIntBig(257),
              q = ft.fromBase64(d.message_content.body).asSlice(),
              E = me(q).agreement,
              D = `${E.holder.toString()}:${F.toString()}:option:${B}`;
            if (await t.redis.exists(D)) return;
            let Bt = {
              optionId: B,
              status: "deployed",
              address: _.parse(d.destination),
              agreement: E,
            };
            t.redis.set(D, JSON.stringify(Bt, I)),
              r.add(
                D,
                { redisKey: D },
                { repeat: { every: 5e3 }, removeOnComplete: !0, repeatJobKey: D },
              );
          });
      },
      { connection: t.redis },
    );
    i.on("completed", (s) => {
      e.info(`${s?.id} has completed!`);
    }),
      i.on("failed", (s, o) => {
        e.error(`${s?.id} has failed with ${o.stack}`);
      });
    let l = new pe({ endpoint: "https://testnet-v4.tonhubapi.com/" }),
      g = new ut(
        yt,
        async (s) => {
          let o = JSON.parse((await t.redis.get(s.data.redisKey)) || "{}", Be);
          o.status === "settled" &&
            s.repeatJobKey &&
            (r.removeRepeatableByKey(s.repeatJobKey),
            e.info(`Removed repeatable job with key ${s.repeatJobKey}`));
          let p = l.open(fe.fromAddress(o.address));
          if (o.status === "deployed")
            try {
              let f = await p.getStrikePrice();
              if (!f) return;
              let c = { ...o, status: "initiated", strikePrice: Number(f) };
              await t.redis.set(s.data.redisKey, JSON.stringify(c, I));
            } catch (f) {
              if (f instanceof Error && f.message.includes(be)) {
                let c = new URLSearchParams();
                c.set("account", o.address.toString()), c.set("limit", "20"), c.set("offset", "0");
                let u = await fetch(`${gt}/transactions?${c.toString()}`, {
                  headers: { "X-API-KEY": t.config.RPC_PROVIDER_API_KEY },
                });
                if (!u.ok) {
                  let E = await u.json();
                  e.error(
                    `Could not fetch option transactions for ${o.address.toString()}. Error: ${u.statusText}`,
                  ),
                    M.captureException(
                      new Error(
                        `Could not fetch option transactions for ${o.address.toString()}. Error: ${E}`,
                      ),
                    );
                  return;
                }
                let { transactions: d } = await u.json();
                if (!d.length) return;
                let C = d.find((E) => E.out_msgs.some((D) => D?.opcode === Ce)),
                  S = d.find((E) => E.out_msgs.some((D) => D?.opcode === he)),
                  F = d.find((E) => E.out_msgs.some((D) => D?.opcode === Se));
                if (!C && !S && !F) return;
                let B = { ...o, strikePrice: 0, status: "settled" };
                await t.redis.set(s.data.redisKey, JSON.stringify(B, I)),
                  (await r.removeRepeatableByKey(s.repeatJobKey)) &&
                    e.info(`Removed repeatable job with key ${s.repeatJobKey}`);
              }
            }
          else if (o.status === "initiated")
            try {
              let f = await p.getExpiration();
              if (f && f + ye < BigInt(Math.ceil(Date.now() / 1e3))) {
                e.info(`Option ${o.optionId} has expired`);
                let c = { ...o, status: "expired" };
                await t.redis.set(s.data.redisKey, JSON.stringify(c, I));
              }
            } catch {
              let c = { ...o, status: "settled" };
              await t.redis.set(s.data.redisKey, JSON.stringify(c, I));
            }
        },
        { connection: t.redis, concurrency: 10 },
      );
    g.on("completed", (s) => {
      e.info(`${s.name} has completed!`);
    }),
      g.on("failed", (s, o) => {
        e.error(`${s?.id} has failed with ${o.stack}`);
      }),
      t.get(
        "/:trader/:broker/options",
        {
          schema: {
            params: P.object({
              trader: P.string().transform((s, o) => {
                try {
                  return _.parse(s);
                } catch {
                  o.addIssue({
                    code: P.ZodIssueCode.custom,
                    message: "Provided trader address is not valid",
                  });
                }
              }),
              broker: P.string().transform((s, o) => {
                try {
                  return _.parse(s);
                } catch {
                  o.addIssue({
                    code: P.ZodIssueCode.custom,
                    message: "Provided broker address is not valid",
                  });
                }
              }),
            }).required(),
          },
        },
        async (s, o) => {
          let { trader: p, broker: f } = s.params,
            c = await t.redis.keys(`${p.toString()}:${f.toString()}:option:*`);
          if (!c.length)
            return o
              .code(404)
              .send({ statusCode: 404, message: "No options found for the provided trader" });
          let u = await t.redis.mget(c),
            d = new Response(`[${u.filter((C) => C !== null).join(",")}]`, {
              headers: { "content-type": "application/json" },
            });
          return o.code(200).send(d);
        },
      );
  },
  Ct = De;
var Ee = async (t) => {
    await t.register(it), await t.register(pt), await t.register(Ct);
  },
  ht = Ee;
import * as St from "@sentry/node";
var m = Pe({ logger: { level: process.env.LOG_LEVEL } }).withTypeProvider();
St.setupFastifyErrorHandler(m);
m.setValidatorCompiler(_e);
m.setSerializerCompiler(Ie);
await m.register(U);
await m.register(Te, { origin: "*" });
await m.register(we);
await m.register(Fe, { secret: m.config.JWT_SECRET });
await m.register(Ae, {
  openapi: {
    openapi: "3.0.0",
    info: {
      title: "Test swagger",
      description: "Testing the Fastify swagger API",
      version: "0.1.0",
    },
    servers: [{ url: "http://localhost:3000", description: "Development server" }],
    tags: [
      { name: "user", description: "User related end-points" },
      { name: "code", description: "Code related end-points" },
    ],
    components: { securitySchemes: { apiKey: { type: "apiKey", name: "apiKey", in: "header" } } },
    externalDocs: { url: "https://swagger.io", description: "Find more info here" },
  },
});
await m.register(Re, {
  routePrefix: "/reference",
  configuration: { spec: { content: () => m.swagger() } },
});
await m.register(Oe, { options: { maxPayload: 1048576 } });
await m.register(ke, { url: m.config.REDIS_URI, maxRetriesPerRequest: null });
await m.register(x);
m.get("/", (t, e) => e.code(418).send({ message: "I am a teapot" }));
await m.register(ht);
await m.ready();
var N = m;
process.on("unhandledRejection", (t) => {
  console.error(t), process.exit(1);
});
var Ne = +N.config.API_PORT,
  Ke = N.config.API_HOST;
await N.listen({ host: Ke, port: Ne });
for (let t of ["SIGINT", "SIGTERM"])
  process.on(t, () =>
    N.close().then((e) => {
      console.log(`close application on ${t}`), process.exit(e ? 1 : 0);
    }),
  );
var Hn = void 0;
export { Hn as default };
//# sourceMappingURL=index.js.map
