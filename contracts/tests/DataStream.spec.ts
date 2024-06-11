import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import { toNano } from "@ton/core";
import { DataStream } from "../wrappers/DataStream";
import "@ton/test-utils";

describe("DataStream", () => {
  let blockchain: Blockchain;
  let publisher: SandboxContract<TreasuryContract>;
  let dataStream: SandboxContract<DataStream>;

  beforeEach(async () => {
    blockchain = await Blockchain.create();

    publisher = await blockchain.treasury("publisher");

    dataStream = blockchain.openContract(
      await DataStream.fromInit(publisher.address, "candlestick.1.BTCUSDT"),
    );

    const DSTDeploy = await dataStream.send(
      publisher.getSender(),
      {
        value: toNano("7.00"),
      },
      {
        $$type: "DSTDeploy",
        queryId: 0n,
      },
    );

    expect(DSTDeploy.transactions).toHaveTransaction({
      from: publisher.address,
      to: dataStream.address,
      deploy: true,
      success: true,
    });
  });

  it("(1) Should deploy a data stream", async () => {
    // This check is done inside beforeEach.
    // Blockchain and Data Stream are ready to use.
  });

  it("(2) Should deploy subscription batches", async () => {
    // TODO: This check should be done inside beforeEach.

    // TODO: You should try creating the 11th batch and expect the data stream to throw an error.

    // The blockchain, the data stream with 10 subscription batches are ready to use.
  });

  it("(3) Should deploy a session", async () => {
    // TODO:
  });
});
