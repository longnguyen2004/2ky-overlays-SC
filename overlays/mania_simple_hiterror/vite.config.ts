import { commonConfig } from "@overlays/vite-config";
import { mergeConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default mergeConfig(commonConfig, {
  plugins: [svelte()],
})
