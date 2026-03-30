import type { Pet } from "../types/pet";

type PetDetailsProps = {
  pet: Pet | null;
  loading: boolean;
};

function PetDetails({ pet, loading }: PetDetailsProps) {
  return (
    <div>
      <h2>Détails de l'animal</h2>

      {loading ? (
        <p>Loading details...</p>
      ) : !pet ? (
        <p>Veuillez sélectionner un animal.</p>
      ) : (
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
          }}
        >
          <p><strong>Nom:</strong> {pet.name}</p>
          <p><strong>Espèce:</strong> {pet.species}</p>
          <p><strong>Typage:</strong> {pet.breed || "—"}</p>
          <p>
            <strong>Date de naissance:</strong>{" "}
            {pet.birthDate ? new Date(pet.birthDate).toLocaleDateString() : "—"}
          </p>
          <p><strong>Sexe:</strong> {pet.sex || "—"}</p>
          <p><strong>Apparence:</strong> {pet.color || "—"}</p>
          <p><strong>Notes:</strong> {pet.notes || "—"}</p>
          <p>
            <strong>Créé le:</strong>{" "}
            {new Date(pet.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Dernière modification:</strong>{" "}
            {new Date(pet.updatedAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}

export default PetDetails;