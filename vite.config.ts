import { defineConfig, loadEnv  } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), 'VITE_'); 
  
    return {
      define: {
        __VITE_API_URL__: JSON.stringify(env.VITE_API_URL),
        __VITE_CLIENT_API_URL__: JSON.stringify(env.VITE_CLIENT_API_URL),
        __VITE_NODE_ENV__: JSON.stringify(env.VITE_NODE_ENV),
      },
      plugins: [react(), tailwindcss()],
    };
  });