import { mergeConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { commonConfig } from "@overlays/vite-config"

// https://vitejs.dev/config/
export default mergeConfig(commonConfig, {
  plugins: [svelte()],
})
