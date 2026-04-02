import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface LastRound {
  uuid: string;
  roundUuid: string;
  roundListDataUuid: string;
}

interface LastRoundState {
  lastRound: LastRound | null;
  setLastRound: (lastRound: any) => void;
  clearLastRound: () => void;
}

export const useLastRoundStore = create<LastRoundState>()(
  persist(
    (set) => ({
      lastRound: null,
      setLastRound: (lastRound: any) => set({ lastRound }),
      clearLastRound: () => set({ lastRound: null }),
    }),
    {
      name: "last-round-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
