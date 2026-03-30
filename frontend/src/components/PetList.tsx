import type { Pet } from "../types/pet";

type PetListProps = {
  pets: Pet[];
  loading: boolean;
  onSelect: (id: number) => void;
  onEdit: (pet: Pet) => void;
  onDelete: (id: number) => void;
};

function PetList({ pets, loading, onSelect, onEdit, onDelete }: PetListProps) {
  return (
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
                onClick={() => onSelect(pet.id)}
              >
                {pet.name}
              </strong>{" "}
              ({pet.species}){" "}
              <button onClick={() => onEdit(pet)}>Modifier les données</button>{" "}
              <button onClick={() => onDelete(pet.id)}>Supprimer</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PetList;