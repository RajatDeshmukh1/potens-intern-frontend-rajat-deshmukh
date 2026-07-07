import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // <-- This must point exactly to the index.css file in the same folder
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)