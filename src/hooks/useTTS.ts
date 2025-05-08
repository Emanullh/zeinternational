// EN TU HOOK useTTS
import { functionsInstance, httpsCallable } from '@/firebase';
// Importa el tipo HttpsError si quieres type safety en el catch, aunque 'any' funciona
import { FirebaseError } from 'firebase/app'; // Para un tipado más general de errores de Firebase
// O, si tu versión de firebase-functions lo exporta para el cliente:
// import { HttpsError } from 'firebase/functions'; // Esto es menos común para el cliente

interface TTSInput {
  text: string;
  voiceId: string;
}

interface TTSOutput {
  audioUrl: string;
}

// No necesitas la interfaz TTSError como la definiste antes

export const useTTS = () => {
  const generateTTS = async (text: string, voiceId: string) => {
    try {
      const generateTTSAudio = httpsCallable<TTSInput, TTSOutput>(
        functionsInstance,
        'generateTTSAudio'
      );

      const result = await generateTTSAudio({ text, voiceId });
      return { audioUrl: result.data.audioUrl, error: null };
    } catch (err: any) { // Puedes usar 'any' o un tipo más específico como FirebaseError
      console.error("Error generating TTS (raw error object):", JSON.stringify(err, null, 2)); // Loguea el objeto error completo

      let displayMessage = "Ocurrió un error desconocido.";

      // err.code es el estado (ej. 'resource-exhausted', 'internal')
      // err.message es el mensaje principal del HttpsError
      // err.details es el objeto de detalles opcional

      if (err.code === "resource-exhausted") {
        // Para el error de cooldown, el mensaje específico está en err.message
        displayMessage = err.message; // Esto será "Debes esperar X segundos más..."
      } else if (err.code === "internal" && err.details && (err.details as any).originalError) {
        // Para el error "No se pudo verificar el tiempo de espera..."
        // El mensaje original del error de Firestore está en err.details.originalError
        // Podrías querer mostrar un mensaje más genérico al usuario, o el específico.
        displayMessage = `Error interno: ${(err.details as any).originalError}`;
        // O simplemente el err.message que ya es "No se pudo verificar el tiempo de espera..."
        // displayMessage = err.message;
      } else if (err.message) {
        // Para otros HttpsErrors o errores genéricos
        displayMessage = err.message;
      }

      // Si quieres que el error que devuelves al componente que llama a useTTS
      // contenga más estructura, puedes hacerlo así:
      return {
        audioUrl: null,
        error: {
          code: err.code || 'unknown',
          message: displayMessage, // El mensaje que quieres mostrar al usuario
          details: err.details, // Puedes pasar los detalles completos si son útiles
        },
      };
      // O si solo quieres el mensaje:
      // return { audioUrl: null, error: displayMessage };
    }
  };

  return { generateTTS };
};