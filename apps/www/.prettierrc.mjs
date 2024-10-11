import prettierConfig from "@nenuma/prettier-config" with { type: "json" };

export default {
  ...prettierConfig,
  plugins: ["prettier-plugin-svelte"],
  overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
};
