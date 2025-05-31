
export interface Member {
  id: string;
  name: string;
  photoUrl: string;
  dataAiHint?: string;
  address: string; // Mantido para compatibilidade, será construído a partir dos campos abaixo
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  timeAtChurch: string;
  servesInMinistry: boolean;
  ministriesServed?: string;
  role: string;
  age?: number;
  birthDate: string;
  photoFile?: File;
  isBaptized: boolean;
}
