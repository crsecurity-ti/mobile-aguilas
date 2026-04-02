import { initializeDatabase } from "../index";
import { v4 as uuidv4 } from "uuid";

const getDatabase = async () => {
  const db = await initializeDatabase();
  return db;
};

export const clearProcessStatusDB = async () => {
  const db = await getDatabase();
  return await db?.execute("DELETE FROM ProcessStatus");
};

export const createOrUpdateStatus = async ({
  name,
  value,
}: {
  name: string;
  value: boolean;
}) => {
  const db = await getDatabase();
  const now = new Date().toISOString();

  const result = await db?.execute(
    "SELECT * FROM ProcessStatus WHERE name = ?",
    [name]
  );

  if (result?.rows && result.rows.length > 0) {
    await db?.execute(
      `UPDATE ProcessStatus 
       SET value = ?, lastUpdate = ? 
       WHERE name = ?`,
      [value, now, name]
    );
  } else {
    await db?.execute(
      `INSERT INTO ProcessStatus (id, name, value, createdAt, lastUpdate) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        name,
        value,
        now,
        now
      ]
    );
  }
};

export const clearProcessStatus = async () => {
  await clearProcessStatusDB();
};

export const getProcessStatusByName = async (name: string) => {
  const db = await getDatabase();
  const result = await db?.execute(
    "SELECT * FROM ProcessStatus WHERE name = ?",
    [name]
  );
  return result?.rows;
};
