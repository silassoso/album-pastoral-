export interface Member {
  id: string;
  name: string;
  photoUrl: string;
  address: string;
  timeAtChurch: string;
  ministry: string;
  role: string;
  age?: number; // Made age optional as it can be derived or directly input
  birthDate: string; // Store as string, can be Date object if preferred
  photoFile?: File; // To store the actual file object if uploaded
}
