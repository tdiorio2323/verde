import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { prefetchOnIdle } from "./prefetch";

prefetchOnIdle();

createRoot(document.getElementById("root")!).render(<App />);
