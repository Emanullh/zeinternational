import { create } from 'zustand'

// 1) keep your interface as-is
export interface Integrate {
  integrateid: number
  avatarImage: string
  mmr: number
  laneposition: number
  kickUrl: string
  name: string
  isLive?: boolean
  stream_title?: string | null
}

interface IntegratesState {
  integrates: Integrate[]
  getById: (integrateid: number) => Integrate | undefined
  setIntegrates: (integrates: Integrate[]) => void
}

const store = create<IntegratesState>((set) => ({
  integrates: [],
  getById: (id: number): Integrate | undefined => 
    store.getState().integrates.find((i: Integrate) => i.integrateid === id),
  setIntegrates: (integrates: Integrate[]) => set({ integrates }),
}))

export const useIntegratesStore = store
