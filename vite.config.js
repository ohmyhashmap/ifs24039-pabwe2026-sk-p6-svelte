import { defineConfig, loadEnv } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from "@testing-library/svelte/vite";
import tailwindcss from "@tailwindcss/vite";
import process from "process";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const baseUrl = env.VITE_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1";
  const port = Number(process.env.PORT || env.APP_PORT) || 3004;
  const delcomProxy = {
    "/delcom-api": {
      target: baseUrl,
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/delcom-api/, ""),
    },
  };
  return {
    plugins: [svelte({ prebundleSvelteLibraries: false }), tailwindcss(), svelteTesting()],
    server: { port },
    preview: { host: "0.0.0.0", port, proxy: delcomProxy },
    build: { chunkSizeWarningLimit: 1500 },
    define: {
      // URL absolut Delcom (untuk aset/gambar)
      DELCOM_BASEURL: JSON.stringify(baseUrl),
      // URL untuk request API: di production lewat proxy same-origin (/delcom-api, lihat vercel.json)
      // sehingga tidak ada request preflight CORS.
      DELCOM_API_URL: JSON.stringify(mode === "production" ? "/delcom-api" : baseUrl),
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.js",
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html", "lcov"],
        include: ["src/**/*.{js,svelte}"],
        exclude: ["src/main.js", "src/setupTests.js", "src/test-utils.js", "src/test-stub-icon.svelte", "**/*.test.{js,jsx}", "node_modules/**", ".docs/**"],
        thresholds: { lines: 100, functions: 100, branches: 100, statements: 100 },
      },
    },
  };
});
