export enum QueueStatusEnum {
  QUEUE_PROCESS = "QUEUE_PROCESS",
  STARTED = "STARTED",
  PROCESS = "PROCESS",
  WAITING = "WAITING",
  WAITING_RETRY = "WAITING_RETRY",
  STOP = "STOP",
  STOP_ERROR = "STOP_ERROR",
}

export enum TaskStateEnum {
  SYNC_QUEUE="SYNC_QUEUE",
  WAITING = "WAITING",
  PROCESSING = "PROCESSING",
  ERROR = "ERROR",
  COMPLETED = "COMPLETED",
}

export interface ProcessStatus {
  id: string;
  name: string;
  value: boolean;
  createdAt: Date;
  lastUpdate: Date;
}

export interface ImagesUpload {
  id: string;
  eventUuid: string;
  currentImage: string;
  name: string;
  typeEvent: string;
  contractorUuid: string;
  userUuid: string;
  state: string;
  createdAt: Date;
  lastUpdate: Date;
}
