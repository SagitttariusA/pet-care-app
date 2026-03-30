export type Pet = {
  id: number;
  name: string;
  species: string;
  breed?: string | null;
  birthDate?: string | null;
  sex?: string | null;
  color?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PetFormData = {
  name: string;
  species: string;
  breed?: string;
  birthDate?: string;
  sex?: string;
  color?: string;
  notes?: string;
}