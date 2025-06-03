import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    server: {
         port: process.env.VITE_PORT ? Number(process.env.VITE_PORT) : 5173,
         strictPort: true, // Ngăn Vite chọn cổng khác nếu 5173 bị chiếm
         open: true, // Tùy chọn: tự động mở trình duyệt
       },
  }
})
