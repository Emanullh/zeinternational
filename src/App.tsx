// src/App.tsx
import React, { useEffect, useState } from 'react'; // <--- Añadir useEffect, useState
import { RouterProvider } from 'react-router'; // <--- Asumo react-router-dom

import ErrorBoundary from './components/ErrorBoundary';
import router from './router';
import { authInstance } from './firebase'; // <--- Importar authInstance
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth'; // <--- Importar funciones de auth

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null); // <--- Estado para el usuario
  const [isAuthLoading, setIsAuthLoading] = useState(true); // <--- Estado para la carga de auth

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      if (user) {
        setCurrentUser(user);
        console.log("Usuario conectado (anónimo):", user.uid, "Es anónimo:", user.isAnonymous);
      } else {
        console.log("Ningún usuario conectado. Intentando inicio de sesión anónimo...");
        signInAnonymously(authInstance)
          .then((userCredential) => {
            // onAuthStateChanged debería activarse, pero podemos establecerlo aquí
            setCurrentUser(userCredential.user);
            console.log("Inicio de sesión anónimo exitoso:", userCredential.user.uid);
          })
          .catch((error) => {
            console.error("Error en el inicio de sesión anónimo:", error);
            // Considera mostrar un mensaje de error al usuario o reintentar
          });
      }
      setIsAuthLoading(false);
    });

    // Limpiar la suscripción cuando el componente se desmonte
    return () => unsubscribe();
  }, []); // Ejecutar solo una vez al montar

  if (isAuthLoading) {
    // Puedes mostrar un spinner de carga global o un componente de carga simple
    return <div>Cargando aplicación...</div>;
  }

  // Una vez que la autenticación ha intentado cargar (éxito o no), renderiza el router
  return (
    <ErrorBoundary>
      {/* Podrías pasar currentUser o isAuthLoading al router si es necesario
          usando Context API o directamente a los componentes si tu router lo permite */}
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};

App.displayName = 'App';
export default App;