
export interface Member {
  id: string;
  name: string;
  photoUrl: string;
  dataAiHint?: string;
  address: string; 
  timeAtChurch: string;
  servesInMinistry: boolean;
  ministriesServed?: string;
  role: string;
  age?: number;
  birthDate: string;
  photoFile?: File;
  isBaptized: boolean;
}
