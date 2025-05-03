import { create } from 'zustand'
import integratesDataRaw from '../data/integrates.json'

// 1) keep your interface as-is
export interface Integrate {
  integrateid: number
  avatarImage: string
  mmr: number
  laneposition: 1 | 2 | 3 | 4 | 5
  kickUrl: string
}

interface IntegratesState {
  integrates: Integrate[]
  getById: (integrateid: number) => Integrate | undefined
}

// 2) assert the raw JSON to your strict type
const integratesData = integratesDataRaw as unknown as Integrate[]

export const useIntegratesStore = create<IntegratesState>(() => ({
  integrates: integratesData,
  getById: (id) => integratesData.find((i) => i.integrateid === id),
}))
