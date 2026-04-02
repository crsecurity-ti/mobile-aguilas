import firestore from "@react-native-firebase/firestore";
import { format } from "date-fns";

export const createErrorLogInFirestore = async ({
  error,
  errorType,
  data,
  userUuid,
}: {
  error: string;
  errorType: string;
  data: any;
  userUuid: string;
}) => {
  const docRef = firestore().collection("errorLog");
  const newData = {
    error,
    errorType,
    data,
    userUuid,
    day: format(new Date(), "yyyy-MM-dd"),
    createdAt: new Date().getTime(),
  };
  return await docRef.add(newData);
};
