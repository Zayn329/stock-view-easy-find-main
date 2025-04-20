import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Server configuration should be at the top level
  server: {
    host: "::", // Keep your host and port settings
    port: 5173,
    // Add the proxy configuration here
    proxy: {
      '/api': { // Requests starting with /api
        target: 'http://localhost:5000', // Will be forwarded to your Flask API
        changeOrigin: true, // Recommended for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api/, '') // Remove /api prefix before forwarding
      }
    }
  },
  plugins: [
    react(),
    // Conditionally include componentTagger only in development mode
    mode === 'development' && componentTagger(),
  ].filter(Boolean), // filter(Boolean) removes any falsy values (like false when mode !== 'development')
  resolve: {
    alias: {
      // Your path alias setup
      "@": path.resolve(__dirname, "./src"),
    },
    // The server proxy configuration was incorrectly placed here
  },
}));
