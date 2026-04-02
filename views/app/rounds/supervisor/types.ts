export interface RoundSupervisor {
  end: string;
  title: string;
  supervisor: Supervisor;
  start: string;
  createdAt: string;
  locations: LocationRoundSupervisor[];
  updatedAt: string;
  uuid: string;
  name: string;
  type: 'consecutive' | 'random';
  supervisorUuid: string;
  day: string;
  startRound?: {
    time: string;
  };
  endRound?: {
    time: string;
  };
}

export interface LocationRoundSupervisor {
  type: string;
  qrCode: string;
  nfcCode: string;
  contractorUuid: string;
  contractor: Contractor;
  uuid: string;
  status?: string;
}

export interface Contractor {
  lat: number;
  description: string;
  createdAt: string;
  name: string;
  uuid: string;
  lng: number;
  qrCode: string;
  nfcCode: string;
  nfc: string;
  updatedAt: string;
  emails?: Email[];
}

export interface Email {
  mail: string;
}

export interface Supervisor {
  email: string;
  active: string;
  lastName: string;
  role: string;
  uuid: string;
  contractors: string[];
  displayName: string;
  firstName: string;
}
