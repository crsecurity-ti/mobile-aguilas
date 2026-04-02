import storage from "@react-native-firebase/storage";

import { logCatchErr } from "../../../api/utils/crashlytics";

interface uploadToFirebaseProps {
  uri: string;
  name: string;
  onProgress?: (progress: number) => void;
}

export const uploadToFirebase = async ({
  uri,
  name,
  onProgress,
}: uploadToFirebaseProps) => {
  const imageRef = storage().ref(`images/${name}`);

  const uploadTask = imageRef.putFile(uri);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress && onProgress(progress);
      },
      (error) => {
        logCatchErr(error);
        reject(error);
      },
      async () => {
        const downloadUrl = await imageRef.getDownloadURL();
        resolve({
          downloadUrl,
        });
      },
    );
  });
};
