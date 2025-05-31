
export interface Member {
  id: string;
  name: string;
  photoUrl: string;
  dataAiHint?: string;
  address: string;
  timeAtChurch: string;
  servesInMinistry: boolean; // New field
  ministriesServed?: string; // Renamed from ministry, made optional
  role: string;
  age?: number;
  birthDate: string;
  photoFile?: File;
  isBaptized: boolean; // Novo campo para batismo
}

