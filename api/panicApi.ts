import { logCatchErr } from "./utils/crashlytics";

export const callPanicApi = async ({
  userUuid,
  latitude,
  longitude,
}: {
  userUuid: string;
  latitude: number;
  longitude: number;
}) => {
  try {
    fetch(`${process.env.EXPO_PUBLIC_API_URL}contractor/panic`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userUuid,
        latitude,
        longitude,
      }),
    });
  } catch (e) {
    logCatchErr(e);
  }
};
