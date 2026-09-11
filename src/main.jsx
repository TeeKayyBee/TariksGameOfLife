import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/App.jsx'

/**
 * Main entry point for the React application.
 * 
 * @remarks
 * This file retrieves the DOM element with the ID `root`, initializes the
 * React 19 Root API, and renders the application inside `StrictMode` to detect
 * potential issues and side effects early during development.
 */

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
