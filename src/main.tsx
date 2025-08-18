import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Enhanced error handling for app initialization
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

try {
  const root = createRoot(rootElement);
  root.render(<App />);
} catch (error) {
  console.error("Failed to initialize React app:", error);
  // Fallback error display
  rootElement.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
      <h1>Sivuston lataus epäonnistui / Page Load Failed</h1>
      <p>Päivitä sivu tai yritä myöhemmin uudelleen / Please refresh the page or try again later</p>
      <button onclick="window.location.reload()" style="padding: 10px 20px; margin-top: 10px;">
        Päivitä sivu / Refresh Page
      </button>
    </div>
  `;
}
