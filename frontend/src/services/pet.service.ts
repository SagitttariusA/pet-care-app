const API_URL = "http://localhost:3000/pets";

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

export async function getPets(): Promise<Pet[]> {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error(`GET /pets failed: ${res.status}`);
  }

  return res.json();
}

export async function getPetById(id: number): Promise<Pet> {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    throw new Error(`GET /pets/${id} failed: ${res.status}`);
  }

  return res.json();
}

export async function createPet(data: PetFormData): Promise<Pet> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`POST /pets failed: ${res.status}`);
  }

  return res.json();
}

export async function updatePet(id: number, data: PetFormData): Promise<Pet> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`PUT /pets/${id} failed: ${res.status}`);
  }

  return res.json();
}

export async function deletePet(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`DELETE /pets/${id} failed: ${res.status}`);
  }
}