import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import inject from '@rollup/plugin-inject'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh()
  ],
  build: {
    outDir: "build",
		rollupOptions: {
			plugins: [inject({ Buffer: ['buffer', 'Buffer'] })],
		},
  },
  resolve: {
    alias: {
      path: "path-browserify"
    }
  }
});
