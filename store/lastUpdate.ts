import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface LastUpdateState {
  lastUpdate: number;
  setLastUpdate: (lastUpdate: any) => void;
  clearLastUpdate: () => void;
}

export const useLastUpdateStore = create<LastUpdateState>()(
  persist(
    (set) => ({
      lastUpdate: 0,
      setLastUpdate: (lastUpdate: number) => set({ lastUpdate }),
      clearLastUpdate: () => set({ lastUpdate: 0 }),
    }),
    {
      name: "last-update-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
