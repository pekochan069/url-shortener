import { defineConfig } from "unocss";
import presetUno from "@unocss/preset-uno";

export default defineConfig({
  presets: [presetUno()],
  rules: [
    [/^delay-(\d+)$/, ([, d]) => ({ "transition-duration": `${d}0ms` })],
  ],
});
