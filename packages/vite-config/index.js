import { defineConfig } from "vite";
import del from "rollup-plugin-delete";

export const commonConfig = defineConfig({
    base: "./",
    build: {
        rollupOptions: {
            output: {
                // No hashing, since we're bundling everything into 1 file
                entryFileNames: "assets/[name].js",
                assetFileNames: "assets/[name].[ext]"
            }
        },
    },
    esbuild: {
        supported: {
            "top-level-await": true
        },
        legalComments: "none"
    },
    plugins: [del({
        targets: "dist/config.dev.jsonc",
        hook: "writeBundle"
    })]
});
