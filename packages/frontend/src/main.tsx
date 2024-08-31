import 'reflect-metadata'
import './index.css'
import './i18n'

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(root)
  .render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
