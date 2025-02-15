import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {LoginComponent} from "./loginComponent.tsx";
import { DiaryListComponent } from "./diaryListComponent.tsx";
import { BrowserRouter, Route, Routes } from 'react-router-dom';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<LoginComponent />} /> 
    <Route path="/List of Diaries" element={<DiaryListComponent />} />
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
