import { create } from 'zustand'

interface SelectedParticipantState {
  selectedId: number | null
  setSelectedId: (id: number | null) => void
}

export const useSelectedParticipantStore = create<SelectedParticipantState>(
  (set) => ({
    selectedId: null,
    setSelectedId: (id) => set({ selectedId: id }),
  }),
)
