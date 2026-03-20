import { useEffect, useState } from "react";
import { createPet, deletePet, getPets, getPetById, updatePet, type Pet } from "./services/pet.service";

function App() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [sex, setSex] = useState("");
  const [color, setColor] = useState("");
  const [notes, setNotes] = useState("");

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

    function resetForm() {
    setName("");
    setSpecies("");
    setBreed("");
    setBirthDate("");
    setSex("");
    setColor("");
    setNotes("");
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
        breed: breed.trim(),
        birthDate,
        sex: sex.trim(),
        color: color.trim(),
        notes: notes.trim(),
      });

      resetForm();

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
    setBreed(pet.breed ?? "");
    setBirthDate(pet.birthDate ? pet.birthDate.slice(0, 10) : "");
    setSex(pet.sex ?? "");
    setColor(pet.color ?? "");
    setNotes(pet.notes ?? "");
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
        breed: breed.trim(),
        birthDate,
        sex: sex.trim(),
        color: color.trim(),
        notes: notes.trim(),
      });

      setEditingPetId(null);
      resetForm();
      setSelectedPet(updatedPet);
      await loadPets();

    } catch (err) {
      console.error(err);
      setError("Impossible de modifier l'animal.");
    }
  }

  function handleCancelEdit() {
    setEditingPetId(null);
    resetForm();
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
        <h2>{editingPetId ? "Modifier les données de l'animal" : "Ajouter un animal"}</h2>

        <div
          style={{
            display: "grid",
            gap: "0.75rem",
            maxWidth: "500px",
          }}
        >
          <input
            type="text"
            placeholder="Nom *"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Espèce *"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
          />

          <input
            type="text"
            placeholder="Typage"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
          />

          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />

          <input
            type="text"
            placeholder="Sexe"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
          />

          <input
            type="text"
            placeholder="Apparence"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />

          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button onClick={editingPetId ? handleUpdate : handleCreate}>
            {editingPetId ? "Mettre a jour" : "Ajouter"}
            </button>

            {editingPetId && (
              <button onClick={handleCancelEdit}>Annuler</button>
            )}
          </div>
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
          <h2>Liste des animaux</h2>

          {loading ? (
            <p>Loading...</p>

          ) : pets.length === 0 ? (
            <p>Il n'y a aucun animal pour l'instant.</p>
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
                  <button onClick={() => handleEdit(pet)}>Modifier les données</button>{" "}
                  <button onClick={() => handleDelete(pet.id)}>Supprimer</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2>Détails de l'animal</h2>

          {detailLoading ? (
            <p>Loading details...</p>

          ) : !selectedPet ? (
            <p>Veuillez sélectionner un animal.</p>

          ) : (
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
              }}
            >
              <p><strong>Nom:</strong> {selectedPet.name}</p>
              <p><strong>Espèce:</strong> {selectedPet.species}</p>
              <p><strong>Typage:</strong> {selectedPet.breed || "—"}</p>
              <p>
                <strong>Date de naissance:</strong>{" "}
                {selectedPet.birthDate
                  ? new Date(selectedPet.birthDate).toLocaleDateString()
                  : "—"}
              </p>
              <p><strong>Sexe:</strong> {selectedPet.sex || "—"}</p>
              <p><strong>Apparence:</strong> {selectedPet.color || "—"}</p>
              <p><strong>Notes:</strong> {selectedPet.notes || "—"}</p>
              <p>
                <strong>Créer le:</strong>{" "}
                {new Date(selectedPet.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Dernière modification:</strong>{" "}
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