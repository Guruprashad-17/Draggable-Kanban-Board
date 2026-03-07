import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// This tells Vite how to handle .vue files
export default defineConfig({
    plugins: [vue()],
})