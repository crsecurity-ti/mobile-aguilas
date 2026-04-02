import { useRootNavigationState, useRouter, useSegments } from "expo-router";
import { PropsWithChildren, createContext, useContext, useEffect } from "react";

import { useUserStore } from "../store/auth";

const AuthContext = createContext({ user: undefined });

export function useAuth() {
  return useContext(AuthContext);
}

function useProtectedRoute(user: any) {
  const segments = useSegments();
  const rootSegment = segments[0];
  const currentRoute = segments[1];
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (user === undefined) return;
    if (!rootNavigationState?.key) return;

    if (!user && rootSegment !== "(auth)") {
      router.replace("/sign-in");
      return;
    }

    if (user && rootSegment !== "(app)") {
      router.replace("/home");
      return;
    }

    if (user && rootSegment === "(app)") {
      const phoneVerified = user?.userInformation?.phoneVerified;
      const emailVerified = user?.userInformation?.emailVerified;
      const onProfile = currentRoute === "profile";

      if ((!phoneVerified || !emailVerified) && !onProfile) {
        router.replace("/profile");
      }
    }
  }, [user, rootSegment, currentRoute, rootNavigationState?.key]);
}

export function SessionProvider(props: PropsWithChildren) {
  const user = useUserStore((state) => state.user);

  useProtectedRoute(user);

  return (
    <AuthContext.Provider value={{ user }}>
      {props.children}
    </AuthContext.Provider>
  );
}
