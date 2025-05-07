import { useEffect, useState } from 'react';
import { functionsInstance, httpsCallable } from '@/firebase';
import { useIntegratesStore, Integrate } from '@/stores/useIntegratesStore';
import integratesDataRaw from '@/data/integrates.json';

interface KickPlayerInput {
  integrateid: number;
  avatarImage: string;
  mmr: number;
  laneposition: number;
  name: string;
  kickUrl?: string;
  slug?: string;
}

interface KickPlayerOutput extends KickPlayerInput {
  isLive: boolean;
  stream_title: string | null;
}

export const useIntegrates = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setIntegrates = useIntegratesStore((state) => state.setIntegrates);

  useEffect(() => {
    const loadIntegrates = async () => {
      try {
        const getEnrichedData = httpsCallable<KickPlayerInput[], KickPlayerOutput[]>(
          functionsInstance,
          'getEnrichedPlayersData'
        );

        // Initial data from the JSON file
        const initialData: KickPlayerInput[] = integratesDataRaw;

        const result = await getEnrichedData(initialData);
        // Convert KickPlayerOutput to Integrate
        const integrates: Integrate[] = result.data.map(player => ({
          integrateid: player.integrateid,
          avatarImage: player.avatarImage,
          mmr: player.mmr,
          laneposition: player.laneposition,
          name: player.name,
          kickUrl: player.kickUrl || '',
          isLive: player.isLive,
          stream_title: player.stream_title
        }));
        
        setIntegrates(integrates);
      } catch (err: any) {
        console.error("Error loading integrates data:", err);
        setError(`Error: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadIntegrates();
  }, [setIntegrates]);

  return { isLoading, error };
}; 