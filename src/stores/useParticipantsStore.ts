import { create } from 'zustand'
import participantsData from '@/data/participants.json'

export interface Participant {
  id: number
  name: string
  teamId: number
  image: string
}

interface ParticipantsState {
  participants: Participant[]
  getById: (id: number) => Participant | undefined
}

export const useParticipantsStore = create<ParticipantsState>(() => ({
  participants: participantsData,
  getById: (id) => participantsData.find((p) => p.id === id),
}))
