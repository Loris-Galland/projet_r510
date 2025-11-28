import { currentLang } from "./i18n.js";

const BASE_API = "http://localhost:3000";
const BASE_POKEDEX = `${BASE_API}/pokedex`;
const BASE_FUSION = `${BASE_API}/fusion`;

// Charge les listes déroulantes avec tous les Pokémon
async function loadPokemonSelects() {
  try {
    const res = await fetch(BASE_POKEDEX);
    const pokemons = await res.json();

    const select1 = document.getElementById("selectPokemon1");
    const select2 = document.getElementById("selectPokemon2");

    pokemons.forEach((p) => {
      const opt1 = document.createElement("option");
      opt1.value = p._id;
      opt1.textContent = p.name[currentLang] || p.name.french;
      select1.appendChild(opt1);

      const opt2 = document.createElement("option");
      opt2.value = p._id;
      opt2.textContent = p.name[currentLang] || p.name.french;
      select2.appendChild(opt2);
    });
  } catch (err) {
    console.error("Erreur chargement pokémons pour fusion :", err);
  }
}

// Clique sur "Fusionner"
document.getElementById("fusionBtn").addEventListener("click", async () => {
  const id1 = document.getElementById("selectPokemon1").value;
  const id2 = document.getElementById("selectPokemon2").value;

  if (!id1 || !id2) {
    alert("Choisis deux Pokémon à fusionner.");
    return;
  }

  try {
    const res = await fetch(`${BASE_FUSION}?id1=${id1}&id2=${id2}`);
    const data = await res.json(); // data contient maintenant data.pokemon

    document.getElementById("fusion-result").innerHTML = `
      <h2>Fusion : ${data.pokemon.name.french}</h2>
      <p><strong>Types fusionnés :</strong> ${data.pokemon.type.join(", ")}</p>
      <h3>Stats moyennes :</h3>
      <pre>${JSON.stringify(data.pokemon.base, null, 2)}</pre>
      <p><strong>Nouveau ID :</strong> ${data.pokemon.id}</p>
      <p>Pokémon enregistré en base — retourne au Pokédex pour le voir.</p>
    `;
  } catch (err) {
    console.error("Erreur côté front fusion :", err);
    alert("Erreur lors de la fusion");
  }
});

// Chargement initial des selects
loadPokemonSelects();
