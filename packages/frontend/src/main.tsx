import 'reflect-metadata'
import './index.css'
import './i18n'

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!)
  .render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
