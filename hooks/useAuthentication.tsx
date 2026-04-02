import auth from "@react-native-firebase/auth";
import { useEffect, useState } from "react";

export function useAuthentication() {
  const [user, setUser] = useState<any>();

  useEffect(() => {
    const unsubscribeFromAuthStatusChanged = auth().onAuthStateChanged(
      (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          setUser(user);
        } else {
          // User is signed out
          setUser(undefined);
        }
      },
    );

    return unsubscribeFromAuthStatusChanged;
  }, []);

  return {
    user,
  };
}
