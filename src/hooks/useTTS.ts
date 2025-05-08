import { functionsInstance, httpsCallable } from '@/firebase';

interface TTSInput {
  text: string;
  voiceId: string;
}

interface TTSOutput {
  audioUrl: string;
}

export const useTTS = () => {
  const generateTTS = async (text: string, voiceId: string) => {
    try {
      const generateTTSAudio = httpsCallable<TTSInput, TTSOutput>(
        functionsInstance,
        'generateTTSAudio'
      );

      const result = await generateTTSAudio({ text, voiceId });
      return result.data.audioUrl;
    } catch (err: any) {
      console.error("Error generating TTS:", err);
      throw new Error(`Error generating TTS: ${err.message}`);
    }
  };

  return { generateTTS };
}; 