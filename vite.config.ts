import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Split heavy, stable vendor libs into their own chunks so the main app
        // bundle stays under the 500 kB advisory and vendors cache independently.
        // (rolldown requires manualChunks as a function.)
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'motion-vendor';
            if (id.includes('react-dom') || id.includes('react-router') || id.includes('/react/')) return 'react-vendor';
          }
        },
      },
    },
  },
})
