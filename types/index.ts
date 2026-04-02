import { LocationLastPosition } from "../store/location";

export interface Contractor {
  uuid?: string;
  name: string;
  description: string;
  qrCode: string;
  nfcCode: string;
  lat: number;
  lng: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoundLocationsType {
  id: string;
  joinPosition: number;
  lat: number | string;
  lng: number | string;
  name: string;
  qrCode: string;
  nfcCode?: string;
  uuid: string;
}

export interface Round {
  uuid?: string;
  qrCode?: string;
  nfcCode?: string;
  name: string;
  roundType: "gps" | "nfc" | "qr";
  locations: RoundLocationsType[];
  guards: {
    blockedTime: number;
    repeatTimes: number;
    uuid: string;
  }[];
  contractorUuid: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocationType {
  id?: string;
  joinPosition: number;
  lat: number;
  lng: number;
  nfc: string;
  name: string;
  qrCode: string;
  nfcCode: string;
  uuid: string;
}

export interface Location {
  id?: string;
  joinPosition: number;
  lat: number;
  lng: number;
  name: string;
  qrCode: string;
  nfcCode: string;
  uuid: string;
}

export interface LocationRoundForTheDay extends Location {
  status: string;
  checkData: any;
}

export interface RoundsForTheDay {
  blockedTime: string;
  uuid: string;
  name: string;
  locations: LocationRoundForTheDay[];
  description?: string;
  startRound: typeRoundTime;
  endRound: typeRoundTime;
}

export interface RoundByDay {
  roundUuid?: string;
  dayFormatted?: string;
  createdAt?: string;
  updatedAt?: string;
  roundsForTheDay: RoundsForTheDay[];
  guardUuid?: string;
}

export type typeRoundTime = {
  time?: string;
  location: LocationLastPosition;
};

export interface Event {
  uuid: string;
  contractorUuid: string;
  description?: string;
  createdAt: string;
  photos: string[];
  phoneImages?: string[];
  images?: string[];
  category: string;
  categoryUuid?: string;
}

export interface Worker {
  uuid?: string;
  contractorUuid: string;
  name: string;
  rut: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccessControlWorker {
  uuid: string;
  contractorUuid: string;
  workerUuid: string;
  status: "start" | "in" | "out" | "end";
  directedTo?: string;
  authorizedBy?: string;
  vehiclePlate?: string;
  createdAt: number;
}
