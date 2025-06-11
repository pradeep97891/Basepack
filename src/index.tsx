import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import "./assets/scss/index.scss";
import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "./languages/Language.context";
import { AppStoreProvider } from "./stores/Store";

const container = document.getElementById("app") as HTMLElement;
const root = ReactDOM.createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
      <BrowserRouter>
        <AppStoreProvider>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </AppStoreProvider>
      </BrowserRouter>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.unregister();

// Register the service worker
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/service-worker.js')
//       .then(registration => {
//         console.log('Service Worker registered with scope:', registration.scope);
//       })
//       .catch(error => {
//         console.error('Service Worker registration failed:', error);
//       });
//   });
// }

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
