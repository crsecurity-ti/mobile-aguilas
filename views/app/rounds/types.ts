export interface RoundGuard {
  roundUuid: string;
  guardUuid: string;
  roundsForTheDay: RoundsForTheDay[];
  dayFormatted: string;
  uuid: string;
  enableShiftNextDay: boolean;
  shiftLimitStart: string;
  shiftLimitEnd: string;
  name?: string;
}

export interface RoundsForTheDay {
  endRound: Round;
  name: string;
  locations: LocationElement[];
  blockedTime: string;
  type?: string;
  uuid: string;
  startRound: Round;
}

export interface Round {
  location: EndRoundLocation;
  time: string;
}

export interface EndRoundLocation {}

export interface LocationElement {
  qrCode: string;
  nfcCode: string;
  name: string;
  id?: string;
  uuid: string;
  lat: number | string;
  lng: number | string;
  joinPosition: number;
  status: Status;
}

export enum Status {
  Pending = "pending",
  Check = "check",
}
