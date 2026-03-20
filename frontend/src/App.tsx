import { useEffect, useState } from "react";
import { createPet, deletePet, getPets, getPetById, updatePet, type Pet } from "./services/pet.service";

function App() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  const [editingPetId, setEditingPetId] = useState<number | null>(null);

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

  async function handleCreate() {
    try {
      if (!name.trim() || !species.trim()) {
        setError("Le nom et l'espèce sont obligatoires.");
        return;
      }

      setError("");
      const createdPet = await createPet({
        name: name.trim(),
        species: species.trim(),
      });

      setName("");
      setSpecies("");
      await loadPets();
      setSelectedPet(createdPet);
    } catch (err) {
      console.error(err);
      setError("Impossible de créer l'animal.");
    }
  }

  function handleEdit(pet: Pet) {
    setEditingPetId(pet.id);
    setName(pet.name);
    setSpecies(pet.species);
    setSelectedPet(pet);
    setError("");
  }

  async function handleUpdate() {
    try {
      if (editingPetId === null) {
        setError("Aucun animal sélectionné pour la modification.");
        return;
      }

      if (!name.trim() || !species.trim()) {
        setError("Le nom et l'espèce sont obligatoires.");
        return;
      }

      setError("");
      const updatedPet = await updatePet(editingPetId, {
        name: name.trim(),
        species: species.trim(),
      });

      setEditingPetId(null);
      setName("");
      setSpecies("");
      setSelectedPet(updatedPet);
      await loadPets();

    } catch (err) {
      console.error(err);
      setError("Impossible de modifier l'animal.");
    }
  }

  function handleCancelEdit() {
    setEditingPetId(null);
    setName("");
    setSpecies("");
    setError("");
  }

  async function handleDelete(id: number) {
    try {
      setError("");
      await deletePet(id);

      if (editingPetId === id) {
        handleCancelEdit();
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

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>{editingPetId ? "Edit pet" : "Add a pet"}</h2>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Espece"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
          />
          <button onClick={editingPetId ? handleUpdate : handleCreate}>
            {editingPetId ? "Mettre a jour" : "Ajouter"}
          </button>

          {editingPetId && (
            <button onClick={handleCancelEdit}>Anuller</button>
          )}
        </div>
      </section>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

       <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        <div>
          <h2>Pets</h2>

          {loading ? (
            <p>Loading...</p>
          ) : pets.length === 0 ? (
            <p>No pets yet.</p>
          ) : (
            <ul>
              {pets.map((pet) => (
                <li key={pet.id} style={{ marginBottom: "0.75rem" }}>
                  <strong
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSelectPet(pet.id)}
                  >
                    {pet.name}
                  </strong>{" "}
                  ({pet.species}){" "}
                  <button onClick={() => handleEdit(pet)}>Edit</button>{" "}
                  <button onClick={() => handleDelete(pet.id)}>Delete</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2>Pet details</h2>

          {detailLoading ? (
            <p>Loading details...</p>
          ) : !selectedPet ? (
            <p>Select a pet to see its details.</p>
          ) : (
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
              }}
            >
              <p><strong>Name:</strong> {selectedPet.name}</p>
              <p><strong>Species:</strong> {selectedPet.species}</p>
              <p><strong>Breed:</strong> {selectedPet.breed || "—"}</p>
              <p>
                <strong>Birth date:</strong>{" "}
                {selectedPet.birthDate
                  ? new Date(selectedPet.birthDate).toLocaleDateString()
                  : "—"}
              </p>
              <p><strong>Sex:</strong> {selectedPet.sex || "—"}</p>
              <p><strong>Color:</strong> {selectedPet.color || "—"}</p>
              <p><strong>Notes:</strong> {selectedPet.notes || "—"}</p>
              <p>
                <strong>Created at:</strong>{" "}
                {new Date(selectedPet.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Updated at:</strong>{" "}
                {new Date(selectedPet.updatedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;