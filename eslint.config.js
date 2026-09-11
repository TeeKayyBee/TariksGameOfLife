import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

/**
 * Konfiguriert die ESLint-Regeln für das gesamte Projekt unter Verwendung der neuen Flat Config API.
 * 
 * @remarks
 * Das Linter-Setup ignoriert den Build-Ordner (`dist`), aktiviert die empfohlenen JavaScript-Regeln 
 * und bindet die offiziellen Code-Style-Richtlinien für React Hooks sowie das Vite React Refresh Plugin ein.
 * 
 * @see {@link https://eslint.org} für Details zur Flat Config.
 */

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
