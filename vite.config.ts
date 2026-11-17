import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Project site on GitHub Pages: https://ypyl.github.io/mantine-versioned-table/
const repositoryName = 'mantine-versioned-table'

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? `/${repositoryName}/` : '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
