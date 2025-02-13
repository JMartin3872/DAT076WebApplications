import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {LoginComponent} from "./loginComponent.tsx";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoginComponent />
  </StrictMode>,
)
