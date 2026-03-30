import { useEffect, useState } from "react";
import type { Pet, PetFormData } from "../types/pet";

type PetFormProps = {
  initialData: Pet | null;
  isEditing: boolean;
  onSubmit: (data: PetFormData) => void | Promise<void>;
  onCancel: () => void;
};

function PetForm({ initialData, isEditing, onSubmit, onCancel }: PetFormProps) {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [sex, setSex] = useState("");
  const [color, setColor] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSpecies(initialData.species);
      setBreed(initialData.breed ?? "");
      setBirthDate(initialData.birthDate ? initialData.birthDate.slice(0, 10) : "");
      setSex(initialData.sex ?? "");
      setColor(initialData.color ?? "");
      setNotes(initialData.notes ?? "");
    } else {
      resetForm();
    }
  }, [initialData]);


     function resetForm() {
    setName("");
    setSpecies("");
    setBreed("");
    setBirthDate("");
    setSex("");
    setColor("");
    setNotes("");
  }

  async function handleSubmit() {
    const formData: PetFormData = {
      name: name.trim(),
      species: species.trim(),
      breed: breed.trim(),
      birthDate,
      sex: sex.trim(),
      color: color.trim(),
      notes: notes.trim(),
    };

    await onSubmit(formData);

    if (!isEditing) {
      resetForm();
    }
  }

  return (
    <section style={{ marginBottom: "1.5rem" }}>
      <h2>{isEditing ? "Modifier les données de l'animal" : "Ajouter un animal"}</h2>

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
          <button onClick={handleSubmit}>
            {isEditing ? "Mettre à jour" : "Ajouter"}
          </button>

          {isEditing && <button onClick={onCancel}>Annuler</button>}
        </div>
      </div>
    </section>
  );
}

export default PetForm;