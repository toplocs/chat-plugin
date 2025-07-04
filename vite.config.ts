import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import federation from "@originjs/vite-plugin-federation";
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  plugins: [
    vue(),
    federation({
        name: 'chat-plugin',
        filename: 'plugin.js',
        // Modules to expose
        exposes: {
            './Plugin': './src/components/PluginComponent.vue',
        },
        shared: ['vue']
    }),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: "__tla",
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: i => `__tla_${i}`
    })
  ],
  /*server: {
    port: 3000,
  },*/
  /*define: {
    'process.env': {},
  },*/
  base: process.env.PLUGIN_BASE_PATH || './',
  build: {
    outDir: './dist',
    lib: {
      entry: './src/components/PluginComponent.vue',
      formats: ['es']
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name][extname]'
      }
    }
  }
});
