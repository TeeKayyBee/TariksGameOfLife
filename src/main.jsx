import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/App.jsx'

/**
 * Der Haupteinstiegspunkt für die React-Anwendung.
 * 
 * @remarks
 * Diese Datei holt sich das DOM-Element mit der ID `root`, initialisiert die
 * React 19 Root-API und rendert die Anwendung im `StrictMode`, um potenzielle
 * Probleme und Nebenwirkungen während der Entwicklung frühzeitig zu erkennen.
 */

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
