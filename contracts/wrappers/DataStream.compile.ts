import { CompilerConfig } from "@ton/blueprint";

export const compile: CompilerConfig = {
  lang: "tact",
  target: "contracts/data_stream.tact",
  options: {
    debug: true,
  },
};
