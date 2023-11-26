import path from "path"
import react from "@vitejs/plugin-react"
import basicSsl from '@vitejs/plugin-basic-ssl'
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), basicSsl()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
