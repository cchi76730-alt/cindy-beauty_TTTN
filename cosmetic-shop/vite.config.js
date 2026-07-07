import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const localApiBaseUrl = 'https://localhost:7019'

function replaceApiBaseUrl(apiBaseUrl) {
  return {
    name: 'replace-api-base-url',
    transform(code, id) {
      if (!id.includes('/src/') && !id.includes('\\src\\')) {
        return null
      }

      if (!/\.(js|jsx|ts|tsx)$/.test(id)) {
        return null
      }

      if (!code.includes(localApiBaseUrl) && !code.includes('http://localhost:7019')) {
        return null
      }

      return {
        code: code
          .replaceAll(localApiBaseUrl, apiBaseUrl)
          .replaceAll('http://localhost:7019', apiBaseUrl),
        map: null,
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = env.VITE_API_BASE_URL || localApiBaseUrl

  return {
    plugins: [react(), replaceApiBaseUrl(apiBaseUrl)],
  }
})