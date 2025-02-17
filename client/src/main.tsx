import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {LoginPage} from "./LoginPage.tsx";
import { DiaryListComponent } from "./diaryListComponent.tsx";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import{DiaryComponent} from "./diary_components/diaryComponent.tsx";
import {RegisterPage} from "./RegisterPage.tsx";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/List of Diaries" element={<DiaryListComponent />} />
        <Route path="/diary" element={<DiaryComponent/>} />
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
