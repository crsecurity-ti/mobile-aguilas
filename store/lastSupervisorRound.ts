import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface LastSupervisorRound {
  uuid: string;
}

interface LastSupervisorRoundState {
  LastSupervisorRound: LastSupervisorRound | null;
  setLastSupervisorRound: (LastSupervisorRound: any) => void;
  clearLastSupervisorRound: () => void;
}

export const useLastSupervisorRoundStore = create<LastSupervisorRoundState>()(
  persist(
    (set) => ({
      LastSupervisorRound: null,
      setLastSupervisorRound: (LastSupervisorRound: any) => set({ LastSupervisorRound }),
      clearLastSupervisorRound: () => set({ LastSupervisorRound: null }),
    }),
    {
      name: "last-supervisor-round-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
