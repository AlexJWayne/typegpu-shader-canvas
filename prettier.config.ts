import { type Config } from "prettier";

export default {
  semi: false,
  singleQuote: true,

  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrder: ["^\\.\\./", "^\\./"],
} satisfies Config;
