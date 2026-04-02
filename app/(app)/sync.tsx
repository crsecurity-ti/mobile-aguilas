import { useEffect, useState } from "react";
import { FlatList, Text } from "react-native";

import MainLayout from "../../components/MainLayout";
import SyncItem from "../../components/SyncItem";
import { getAllImagesUploads } from "../../database/services/imagesUpload.service";
import { useLastUpdateStore } from "../../store/lastUpdate";
import { startQueue } from "../../utils/TaskQueueDB/utils/queueUtils";
import { ImagesUpload } from "../../database/model/types";

export default function Sync() {
  const lastUpdate = useLastUpdateStore((state) => state.lastUpdate);
  const [currentImages, setCurrentImages] = useState<ImagesUpload[]>([]);

  const getCurrentImagesToSync = async () => {
    const imagesToUpload = await getAllImagesUploads();
    setCurrentImages(imagesToUpload);
  };

  useEffect(() => {
    if (lastUpdate !== null) {
      getCurrentImagesToSync();
    }
  }, [lastUpdate]);

  useEffect(() => {
    startedSync();
  }, []);

  const startedSync = async () => {
    await startQueue();
  };
  return (
    <>
      <MainLayout>
        {!currentImages || currentImages?.length === 0 ? (
          <Text className="text-green-800 font-bold text-xl text-center mt-10">
            No hay imágenes que sincronizar!
          </Text>
        ) : (
          <FlatList
            data={currentImages}
            renderItem={({ item }) => <SyncItem item={item} />}
            keyExtractor={(item) => item.id}
          />
        )}
      </MainLayout>
    </>
  );
}
