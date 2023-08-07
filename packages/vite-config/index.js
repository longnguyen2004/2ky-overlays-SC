import { defineConfig } from "vite";

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
    }
});
