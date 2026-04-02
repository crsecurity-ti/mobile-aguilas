import { open } from "@op-engineering/op-sqlite";
import { useLastUpdateStore } from "../store/lastUpdate";
import { logCatchErr } from "../api/utils/crashlytics";

let dbInstance: any = null;

export const initializeDatabase = async () => {
  try {
    if (!dbInstance) {
      dbInstance = open({
        name: "quicksqlitetest-typeorm.db",
        location: ":memory:",
      });

      await dbInstance.execute(`
        CREATE TABLE IF NOT EXISTS ImagesUpload (
          id TEXT PRIMARY KEY,
          eventUuid TEXT,
          currentImage TEXT,
          name TEXT,
          typeEvent TEXT,
          contractorUuid TEXT,
          userUuid TEXT,
          state TEXT,
          createdAt TEXT NOT NULL,
          lastUpdate TEXT NOT NULL
        );
      `);

      await dbInstance.execute(`
        CREATE TABLE IF NOT EXISTS ProcessStatus (
          id TEXT PRIMARY KEY,
          name TEXT,
          value INTEGER NOT NULL,
          createdAt TEXT NOT NULL,
          lastUpdate TEXT NOT NULL
        );
      `);

      dbInstance.commitHook(() => {
        try {
          useLastUpdateStore.getState().setLastUpdate(new Date().getTime());
        } catch (e) {
          logCatchErr(e);
        }
      });
    } else {
      console.log("Database already initialized.");
    }

    return dbInstance;
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

initializeDatabase();
