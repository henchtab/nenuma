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

    // Shall we test DSTDeploySuccess as well?
  });

  it("Should deploy a data stream", async () => {
    // the check is done inside beforeEach
    // blockchain and dataStream are ready to use
  });
});
