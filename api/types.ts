export type QRCodeType = "single-use" | "multi-use" | "daily";

export interface QRCodeData {
  uuid: string;
  type: QRCodeType;
  valid: boolean;
  rangeDate?: [string, string];
  contractorUuid: string;
  businessUuid: string;
  name: string;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  maxUsage?: number;
  validatedBy?: string[];
}

export interface QRCodeValidationLog {
    uuid: string;
    qrCodeUuid: string;
    name: string;
    businessUuid: string;
    contractorUuid: string;
    description: string;
    location: {
      latitude: number;
      longitude: number;
    };
    validatedAt: string;
    validatedBy: string;
  }
  