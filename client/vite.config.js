import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const handleBackendProxyError = (error, _request, response) => {
  console.error(`[Vite proxy] Backend unavailable: ${error.message}`);

  if (typeof response?.writeHead === 'function' && typeof response?.end === 'function') {
    response.writeHead(503, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({
      success: false,
      code: 'BACKEND_UNAVAILABLE',
      message: 'Backend API is unavailable. Start the full application with npm run dev from the project root.',
    }));
    return;
  }

  response?.destroy?.();
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        configure: (proxy) => proxy.on('error', handleBackendProxyError),
      },
      '/fhir': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        configure: (proxy) => proxy.on('error', handleBackendProxyError),
      },
      '/socket.io': {
        target: 'http://127.0.0.1:5000',
        ws: true,
        configure: (proxy) => proxy.on('error', handleBackendProxyError),
      }
    }
  }
})
