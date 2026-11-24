import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import { BankProvider } from "./context/BankContext"
import "./css/global.css"
import "./css/layout.css"
import "./css/pages.css"
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <BankProvider>
      <App />
    </BankProvider>
  </BrowserRouter>
)
