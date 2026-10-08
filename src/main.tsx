import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { InvestigationProvider } from './context/InvestigationContext';
import './index.css';

// إزالة شاشة التحميل التمهيدية (Terminal Boot Screen) فور اكتمال الجاهزية
const dismissTerminalBoot = () => {
  const bootElement = document.getElementById('app-terminal-boot');
  if (bootElement) {
    bootElement.style.opacity = '0';
    bootElement.style.visibility = 'hidden';
    setTimeout(() => {
      bootElement.remove();
    }, 450);
  }
};

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('فشل العثور على عنصر الجذر #root في المستند.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <InvestigationProvider>
      <App />
    </InvestigationProvider>
  </React.StrictMode>
);

// تشغيل إنهاء شاشة الإقلاع بعد تركيب الشجرة البرمجية
requestAnimationFrame(() => {
  setTimeout(dismissTerminalBoot, 300);
});
