// src/firebase.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFunctions, Functions, httpsCallable, connectFunctionsEmulator } from "firebase/functions"; // Asegúrate que connectFunctionsEmulator esté importado
import { getAuth, Auth } from "firebase/auth"; // <--- AÑADIR IMPORTACIONES DE AUTH

// Tu configuración de Firebase (reemplaza con tus propios valores si los actuales son placeholders)
const firebaseConfig = {
  apiKey: "AIzaSyC2dCh_DjAiCOXPhU6t0AoBNjzPjqxY-cw", // Asegúrate que este sea tu API key real
  authDomain: "zeinternacional.firebaseapp.com",
  projectId: "zeinternacional",
  storageBucket: "zeinternacional.appspot.com", // <--- CORRECCIÓN: Usualmente es .appspot.com para el bucket por defecto
  messagingSenderId: "542400787878",
  appId: "1:542400787878:web:305190b576a60fc6294b67",
  measurementId: "G-5YTKGDYPSE"
};

// Inicializar Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Obtener una instancia de Firebase Functions
const functionsInstance: Functions = getFunctions(app /*, "tu-region-si-no-es-us-central1" */);

// Obtener una instancia de Firebase Auth <--- AÑADIR ESTO
const authInstance: Auth = getAuth(app);



// Exportar instancias para usar en otros lugares
export { functionsInstance, authInstance, httpsCallable }; // <--- AÑADIR authInstance A EXPORTS
export default app; // Exportar la app de Firebase si la necesitas en otros módulos