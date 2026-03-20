import { useEffect, useState } from "react";
import { createPet, deletePet, getPets, updatePet, type Pet } from "./services/pet.service";

function App() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
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

  async function handleCreate() {
    try {
      if (!name.trim() || !species.trim()) {
        setError("Le nom et l'espèce sont obligatoires.");
        return;
      }

      setError("");
      await createPet({
        name: name.trim(),
        species: species.trim(),
      });

      setName("");
      setSpecies("");
      await loadPets();
    } catch (err) {
      console.error(err);
      setError("Impossible de créer l'animal.");
    }
  }

  function handleEdit(pet: Pet) {
    setEditingPetId(pet.id);
    setName(pet.name);
    setSpecies(pet.species);
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
      await updatePet(editingPetId, {
        name: name.trim(),
        species: species.trim(),
      });

      setEditingPetId(null);
      setName("");
      setSpecies("");
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
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Species"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
          />
          <button onClick={editingPetId ? handleUpdate : handleCreate}>
            {editingPetId ? "Update" : "Add"}
          </button>

          {editingPetId && (
            <button onClick={handleCancelEdit}>Cancel</button>
          )}
        </div>
      </section>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <section>
        <h2>Pets</h2>

        {loading ? (
          <p>Loading...</p>
        ) : pets.length === 0 ? (
          <p>No pets yet.</p>
        ) : (
          <ul>
            {pets.map((pet) => (
              <li key={pet.id} style={{ marginBottom: "0.5rem" }}>
                <strong>{pet.name}</strong> ({pet.species}){" "}
                <button onClick={() => handleEdit(pet)}>Edit</button>{" "}
                <button onClick={() => handleDelete(pet.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;