# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


markdown

/**
 * Paket-Konfiguration für die "game-of-life" React-Applikation.
 * 
 * @private true - Verhindert das versehentliche Veröffentlichen der App im npm-Registry.
 * @version 0.0.0
 * 
 * @section Scripts
 * - `npm run dev`: Startet den lokalen Vite-Entwicklungsserver.
 * - `npm run build`: Kompiliert das Projekt über Vite für die Produktion.
 * - `npm run lint`: Analysiert den Code mittels ESLint auf Fehler.
 * - `npm run preview`: Startet einen lokalen Server, um den Produktions-Build (`dist`) zu testen.
 * 
 * @section Dependencies
 * Basiert auf **React 19** (`react`, `react-dom`).
 * 
 * @section DevDependencies
 * Nutzt **Vite 8** als Bundler und **ESLint 10** für die statische Code-Analyse.
 */