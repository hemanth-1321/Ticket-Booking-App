import { create } from "zustand";

interface EventState {
  id: string;
  eventName: string;
  eventDescription: string;
  eventStartTime: string;
  setEventDetails: (details: Partial<EventState>) => void;
}

export const useEventStore = create<EventState>((set) => ({
  id: "",
  eventName: "",
  eventDescription: "",
  eventStartTime: new Date().toISOString().slice(0, 16),
  setEventDetails: (details) => set((state) => ({ ...state, ...details })),
}));
