import crashlytics from "@react-native-firebase/crashlytics";

export function logCatchErr(error: any) {
  console.log({ error });
  crashlytics().recordError(error);
  crashlytics().sendUnsentReports();
}
