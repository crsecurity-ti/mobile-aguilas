import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface User {
  kind: string;
  localId: string;
  email: string;
  displayName: string;
  businessUuid: string;
  idToken: string;
  registered: boolean;
  refreshToken: string;
  expiresIn: string;
  uuid: string;
  userInformation: UserInformation;
}
export interface HourTrackingConfiguration {
  enableGPS:             boolean;
  enableNFC:             boolean;
  enableQR:              boolean;
  enableShiftLimitEnd:   string;
  enableShiftLimitStart: string;
  maxShiftTime:          number;
  noRestrictions:        boolean;
}

export interface UserInformation {
  role: string;
  lastName: string;
  uuid: string;
  displayName: string;
  businessUuid: string;
  contractors: string[];
  enableHourTracking?: boolean;
  hourTrackingConfiguration?: HourTrackingConfiguration;
  firstName: string;
  email: string;
  active: string;
  contractorUuid?: string;
  phoneNumber?: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
}

interface UserState {
  user: User | null;
  setUser: (user: any) => void;
  updateUserInformation: (patch: Partial<UserInformation>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: any) => set({ user }),
      updateUserInformation: (patch: Partial<UserInformation>) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, userInformation: { ...state.user.userInformation, ...patch } }
            : state.user,
        })),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
