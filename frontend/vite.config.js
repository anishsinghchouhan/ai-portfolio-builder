import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensure all routes (including /auth/callback) fall back to index.html
  // so the SPA can handle Supabase email verification redirects
  appType: 'spa',
})
