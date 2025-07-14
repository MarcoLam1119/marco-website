import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080, // Set the frontend port to 8080
    host: true,
    allowedHosts: ["homepc.marco-lam-web.net","vm.marco-lam-web.net"],
  },
})