import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface LastPositionState {
  lastPosition: LocationLastPosition;
  setLastPosition: (lastPosition: any) => void;
  clearLastPosition: () => void;
}

export const useLastPositionStore = create<LastPositionState>()(
  persist(
    (set) => ({
      lastPosition: {},
      setLastPosition: (lastPosition: LocationLastPosition) =>
        set({ lastPosition }),
      clearLastPosition: () => set({ lastPosition: {} }),
    }),
    {
      name: "position-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export interface LocationLastPosition {
  coords?: Coords;
  timestamp?: number;
}

export interface Coords {
  accuracy: number;
  altitude: number;
  altitudeAccuracy: number;
  heading: number;
  latitude: number;
  longitude: number;
  speed: number;
}
