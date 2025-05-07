// src/firebase.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFunctions, Functions, httpsCallable } from "firebase/functions";

// Tu configuración de Firebase (reemplaza con tus propios valores)
const firebaseConfig = {
  apiKey: "AIzaSyC2dCh_DjAiCOXPhU6t0AoBNjzPjqxY-cw",
  authDomain: "zeinternacional.firebaseapp.com",
  projectId: "zeinternacional",
  storageBucket: "zeinternacional.firebasestorage.app",
  messagingSenderId: "542400787878",
  appId: "1:542400787878:web:305190b576a60fc6294b67",
  measurementId: "G-5YTKGDYPSE"
};

// Inicializar Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Obtener una instancia de Firebase Functions
const functionsInstance: Functions = getFunctions(app /*, "tu-region-si-no-es-us-central1" */);

// Opcional: Si estás usando el emulador de Functions durante el desarrollo
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
  console.log("Conectando Firebase Functions al emulador en localhost:5001");
  // import { connectFunctionsEmulator } from "firebase/functions"; // Importa si no está arriba
  // connectFunctionsEmulator(functionsInstance, "localhost", 5001);
}


// Exportar la instancia de Functions y la función httpsCallable para usar en otros lugares
export { functionsInstance, httpsCallable };
export default app; // Exportar la app de Firebase si la necesitas en otros módulos