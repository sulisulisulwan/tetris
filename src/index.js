import React from 'react'
import App from './App.tsx'
import { createRoot } from 'react-dom/client'
// import { store } from './app/store.js'
// import { Provider } from 'react-redux'

const container = document.getElementById("app")
const root = createRoot(container)
root.render(
  // <Provider>
    <App/>
  // </Provider>
)