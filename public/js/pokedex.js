import { currentLang, setLanguage, initLanguage } from "./i18n.js";

const BASE_URL = "http://localhost:3000/pokedex";

// Initialisation langue
initLanguage();
const selectLang = document.getElementById("langSelect");
selectLang.value = localStorage.getItem("lang") || "fr";
selectLang.addEventListener("change", (e) => {
  setLanguage(e.target.value);
  chargerPokemons(construireUrlFiltres()); // On recharge en gardant les filtres actuels
});

// Fonction centrale pour construire l'URL avec TOUS les filtres 
function construireUrlFiltres() {
  let url = `${BASE_URL}?`;

  // Recherche par nom
  const nom = document.getElementById("nameSearch").value.trim();
  if (nom) url += `name=${nom}&`;

  // Types cochés
  const checkedTypes = Array.from(
    document.querySelectorAll("input[name='typeFilter']:checked")
  ).map((c) => c.value);
  if (checkedTypes.length > 0) url += `types=${checkedTypes.join(",")}&`;

  // Toutes les stats numériques et selects
  const ids = [
    "attackMin", "attackMax",
    "hpMin", "hpMax",
    "spAtkMin", "spAtkMax",
    "spDefMin", "spDefMax",
    "speedMin", "speedMax",
    "weightMin", "weightMax",
    "heightMin", "heightMax",
    "evoLevel",
    "evolutionCount", // select
    "genderSelect",   // select (id="genderSelect", param="gender")
    "sortBy",
    "sortOrder"
  ];

  ids.forEach(id => {
    const element = document.getElementById(id);
    if (element && element.value) {
      // Cas particulier pour le genre dont l'ID est genderSelect mais le param attendu est gender
      const paramName = id === "genderSelect" ? "gender" : 
                        id === "evolutionCount" ? "evo" : id;
      url += `${paramName}=${element.value}&`;
    }
  });

  return url;
}

// --- 2. Fonction d'affichage (Similaire à avant) ---
async function chargerPokemons(customURL = null) {
  // Si aucune URL spéciale n'est fournie, on prend celle de base (tout le monde)
  const url = customURL || BASE_URL;

  try {
    const reponse = await fetch(url);
    const listePokemons = await reponse.json();
    const conteneur = document.getElementById("pokemon-container");
    conteneur.innerHTML = "";

    if (listePokemons.length === 0) {
      conteneur.innerHTML = "<p>Aucun Pokémon trouvé.</p>";
      return;
    }

    listePokemons.forEach((pokemon) => {
      const carte = document.createElement("div");
      carte.className = "pokemon-card";
      carte.innerHTML = `
        <h3>${pokemon.name[currentLang]}</h3>
        <img src="${pokemon.image.sprite}" alt="${pokemon.name[currentLang]}">
        <p>Type: ${pokemon.type.join(", ")}</p>
      `;
      carte.addEventListener("click", () => {
        window.location.href = `pokemon.html?id=${pokemon._id}&lang=${currentLang}`;
      });
      conteneur.appendChild(carte);
    });
  } catch (erreur) {
    console.error("Erreur chargement :", erreur);
  }
}

// Chargement des Types (Checkbox) 
async function chargerTypesFilter() {
  try {
    const res = await fetch("http://localhost:3000/types");
    const types = await res.json();
    const container = document.getElementById("typeCheckboxContainer");

    types.forEach((t) => {
      const div = document.createElement("div");
      div.className = "type-option";
      div.innerHTML = `
        <label>
          <input type="checkbox" name="typeFilter" value="${t.english}">
          ${t.english}
        </label>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
  }
}
chargerTypesFilter();

// Les Écouteurs d'Événements (Events) 

// Bouton Filtrer
document.getElementById("filterBtn").addEventListener("click", () => {
  const url = construireUrlFiltres();
  chargerPokemons(url);
});

// Recherche par nom (Input) - Marche en temps réel avec les autres filtres 
document.getElementById("nameSearch").addEventListener("input", () => {
  const url = construireUrlFiltres();
  chargerPokemons(url);
});

// Bouton Reset
document.getElementById("resetFilters").addEventListener("click", () => {
  // Reset des inputs
  document.querySelectorAll("input").forEach(i => {
    if(i.type === 'checkbox') i.checked = false;
    else i.value = "";
  });
  document.querySelectorAll("select").forEach(s => s.value = "");
  
  // Recharge tout
  chargerPokemons(BASE_URL);
});

// Chargement initial
document.getElementById("loadBtn").addEventListener("click", () => chargerPokemons());
chargerPokemons();