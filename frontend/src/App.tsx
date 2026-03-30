import { useEffect, useState } from "react";
import PetForm from "./components/PetForm";
import PetList from "./components/PetList";
import PetDetails from "./components/PetDetails";
import { createPet, deletePet, getPetById, getPets, updatePet } from "./services/pet.service";
import type { Pet, PetFormData } from "./types/pet";

function App() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  async function loadPets() {
    try {
      setError("");
      const data = await getPets();
      setPets(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les animaux.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPets();
  }, []);

  async function handleSelectPet(id: number) {
    try {
      setError("");
      setDetailLoading(true);
      const pet = await getPetById(id);
      setSelectedPet(pet);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger le détail de l'animal.");
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleSubmitPet(formData: PetFormData) {
    try {
      if (!formData.name || !formData.species) {
        setError("Le nom et l'espèce sont obligatoires.");
        return;
      }

      setError("");

      if (editingPet) {
        const updatedPet = await updatePet(editingPet.id, formData);
        setSelectedPet(updatedPet);
        setEditingPet(null);
      } else {
        const createdPet = await createPet(formData);
        setSelectedPet(createdPet);
      }

      await loadPets();
    } catch (err) {
      console.error(err);
      setError(
        editingPet
          ? "Impossible de modifier l'animal."
          : "Impossible de créer l'animal."
      );
    }
  }

  function handleEdit(pet: Pet) {
    setEditingPet(pet);
    setSelectedPet(pet);
    setError("");
  }

  function handleCancelEdit() {
    setEditingPet(null);
    setError("");
  }

  async function handleDelete(id: number) {
    try {
      setError("");
      await deletePet(id);

      if (editingPet?.id === id) {
        setEditingPet(null);
      }

      if (selectedPet?.id === id) {
        setSelectedPet(null);
      }

      await loadPets();
    } catch (err) {
      console.error(err);
      setError("Impossible de supprimer l'animal.");
    }
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Pet Care App</h1>

      <PetForm
        initialData={editingPet}
        isEditing={editingPet !== null}
        onSubmit={handleSubmitPet}
        onCancel={handleCancelEdit}
      />

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        <PetList
          pets={pets}
          loading={loading}
          onSelect={handleSelectPet}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <PetDetails pet={selectedPet} loading={detailLoading} />
      </section>
    </main>
  );
}

export default App;