import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from "react-router-dom"
import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import zh from './i18n/zh'
import en from './i18n/en'
import App from './App.tsx'

i18n.use(initReactI18next).init({
    resources: {
        zh: {translation: zh},
        en: {translation: en},
    },
    lng: navigator.language.split('-')[0] || 'zh',
    fallbackLng: 'en',
    interpolation: {escapeValue: false},
}).then(() => {
    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <Router>
                <App/>
            </Router>
        </StrictMode>
    )
}).catch((err) => {
    console.error('i18n init failed:', err)
})
