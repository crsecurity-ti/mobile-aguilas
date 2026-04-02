import { initializeDatabase } from "..";
import { ImagesUpload, TaskStateEnum } from "../model/types";

const getDatabase = async () => {
  const db = await initializeDatabase();
  return db;
};

export const createImageUploadToDb = async (
  imagesUploadData: Partial<ImagesUpload>
) => {
  const db = await getDatabase();
  const createdAt = new Date();
  const lastUpdate = new Date();

  await db?.execute(
    `INSERT INTO ImagesUpload (
      id, eventUuid, currentImage, name, typeEvent, contractorUuid, 
      userUuid, state, createdAt, lastUpdate
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      imagesUploadData.id,
      imagesUploadData.eventUuid,
      imagesUploadData.currentImage,
      imagesUploadData.name,
      imagesUploadData.typeEvent,
      imagesUploadData.contractorUuid,
      imagesUploadData.userUuid,
      TaskStateEnum.WAITING,
      createdAt.toISOString(),
      lastUpdate.toISOString(),
    ]
  );
};

export const getAllImagesUploads = async () => {
  const db = await getDatabase();
  const result = await db?.execute("SELECT * FROM ImagesUpload");
  return result?.rows;
};

export const removeImagesUpload = async () => {
  const db = await getDatabase();
  await db?.execute("DELETE FROM ImagesUpload");
};

export const updateImagesUploadInDb = async (
  imagesUploadData: Partial<ImagesUpload>[]
) => {
  const db = await getDatabase();

  for (const image of imagesUploadData) {
    const lastUpdate = new Date().toISOString();
    await db?.execute(
      `UPDATE ImagesUpload 
       SET 
         eventUuid = ?, currentImage = ?, name = ?, typeEvent = ?, 
         contractorUuid = ?, userUuid = ?, state = ?, lastUpdate = ? 
       WHERE id = ?`,
      [
        image.eventUuid,
        image.currentImage,
        image.name,
        image.typeEvent,
        image.contractorUuid,
        image.userUuid,
        image.state,
        lastUpdate,
        image.id,
      ]
    );
  }
};

export const clearImagesUploadRepository = async () => {
  const db = await getDatabase();
  await db?.execute("DELETE FROM ImagesUpload");
};

export const removeImageUploadFromDb = async (id: string) => {
  const db = await getDatabase();
  await db?.execute("DELETE FROM ImagesUpload WHERE id = ?", [id]);
};

export const removeOldImagesUploads = async () => {
  const db = await getDatabase();
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const result = await db?.execute(
    "SELECT * FROM ImagesUpload WHERE createdAt < ?",
    [twoDaysAgo.toISOString()]
  );

  const oldImages = result?.rows?._array;

  if (oldImages && oldImages.length > 0) {
    for (const image of oldImages) {
      await db?.execute("DELETE FROM ImagesUpload WHERE id = ?", [image.id]);
    }
  } else {
    console.log("No images older than 2 days found.");
  }
};
