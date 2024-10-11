import { CHAIN } from "@/constants";
import type { CheckProofRequestDto } from "@/dtos/ton-connect.dto";
import { TonApiService, TonProofService } from "@/services/index";
import { fromNano } from "@ton/ton";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function handleCheckProof(
  request: FastifyRequest<{
    Body: CheckProofRequestDto;
  }>,
  reply: FastifyReply,
) {
  try {
    const client = TonApiService.create(CHAIN.TESTNET);
    const service = new TonProofService();

    const isValid = await service.checkProof(request.body, (address) =>
      client.getWalletPublicKey(address),
    );

    if (!isValid) {
      // TODO: Add proper error object
      return reply.code(400).send({ message: "Invalid proof" });
    }

    const token = request.server.jwt.verify(request.body.proof.payload);

    if (!token.toString()) {
      // TODO: Add proper error object
      return reply.code(400).send({ message: "Invalid token" });
    }

    // FIXME: Why it's named newToken?
    const newToken = await reply.jwtSign(
      {
        address: request.body.address,
        network: request.body.network,
        // FIXME: Remove this data
        name: "Vladimir Starkov",
        email: "test@gmail.com",
      },
      { expiresIn: "180d" },
    );

    // TODO: Add proper response object
    return reply.code(200).send({
      message: "Proof is valid",
      token: newToken,
    });
  } catch (error) {
    console.error(error);
    return reply.code(400).send({ message: "Invalid request", error });
  }
}

export async function handleGenerateProofPayload(request: FastifyRequest, reply: FastifyReply) {
  try {
    const service = new TonProofService();
    const payload = service.generatePayload();

    // FIXME: Why it's named proofToken? Payload?
    const token = await reply.jwtSign({ payload }, { expiresIn: "15m" });
    return reply.code(200).send({
      proofToken: token,
    });
  } catch (error) {
    console.error(error);
    return reply.code(400).send({ message: "Invalid request", error });
  }
}

export async function handleAccountInfo(request: FastifyRequest, reply: FastifyReply) {
  try {
    // @ts-expect-error TODO: Fix this
    const { address, network } = request.user;

    const client = TonApiService.create(network);

    const { account } = await client.getAccountInfo(address);
    return reply.code(200).send({
      address,
      balance: fromNano(account.balance.coins),
    });
  } catch (error) {
    console.error(error);
    return reply.code(400).send({ message: "Invalid request", error });
  }
}
