export interface AccessControl {
  uuid: string;
  contractorUuid: string;
  guardUuid: string;
  name: string;
  rut?: string;
  status: "in" | "out";
  directedTo?: string;
  authorizedBy?: string;
  vehiclePlate?: string;
  createdAt: number;
  updatedAt: number;
}
