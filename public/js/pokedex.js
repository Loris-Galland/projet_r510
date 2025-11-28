import { currentLang, setLanguage, initLanguage } from "./i18n.js";

// URL de base pour l'API
const BASE_URL = "http://localhost:3000/pokedex";

// Initialisation langue choisie précédemment
initLanguage();

// Sélection initiale dans le select (affichage correct)
const selectLang = document.getElementById("langSelect");
selectLang.value = localStorage.getItem("lang") || "fr";
selectLang.addEventListener("change", (e) => {
  setLanguage(e.target.value); // changement langue
  chargerPokemons();
});

// Fonction principale d'affichage des Pokémons
// Peut prendre une URL personnalisée (utile pour filtrage multi-critères)
async function chargerPokemons(customURL = null) {
  const nomRecherche = document.getElementById("nameSearch").value.trim(); // recup nom saisi

  // Construction dynamique de l'URL selon la recherche par nom
  let url = customURL ? customURL : `${BASE_URL}`;
  const params = [];
  if (!customURL) {
    // si pas d'URL custom, on utilise les filtres classiques
    if (nomRecherche) params.push(`name=${nomRecherche}`);
    if (params.length > 0) url += `?${params.join("&")}`;
  }

  try {
    const reponse = await fetch(url);
    const listePokemons = await reponse.json(); // request json
    const conteneur = document.getElementById("pokemon-container");
    conteneur.innerHTML = "";

    listePokemons.forEach((pokemon) => {
      const carte = document.createElement("div");
      carte.className = "pokemon-card";

      // affichage selon langue sélectionnée
      carte.innerHTML = `
        <h3>${pokemon.name[currentLang]}</h3>
        <img src="${pokemon.image.sprite}" alt="${pokemon.name[currentLang]}">
        <p>Type: ${pokemon.type.join(", ")}</p>
      `;

      // Clique sur une carte et redirige vers la page détail du Pokémon
      carte.addEventListener("click", () => {
        window.location.href = `pokemon.html?id=${pokemon._id}&lang=${currentLang}`;
      });

      conteneur.appendChild(carte);
    });
  } catch (erreur) {
    console.error("erreur load pokemon :", erreur);
  }
}

// Charger dynamiquement la liste des types (pour filtre multi-type checkbox)
async function chargerTypesFilter() {
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
}

chargerTypesFilter(); // charge les types au chargement

// Bouton filtrage multi-critères
document.getElementById("filterBtn").addEventListener("click", () => {
  const checkedTypes = Array.from(
    document.querySelectorAll("input[name='typeFilter']:checked")
  ).map((c) => c.value);

  const attackMin = document.getElementById("attackMin").value;
  const attackMax = document.getElementById("attackMax").value;
  const hpMin = document.getElementById("hpMin").value;
  const hpMax = document.getElementById("hpMax").value;
  const evolutionCount = document.getElementById("evolutionCount").value;
  const weightMin = document.getElementById("weightMin").value;
  const weightMax = document.getElementById("weightMax").value;
  const heightMin = document.getElementById("heightMin").value;
  const heightMax = document.getElementById("heightMax").value;
  const evoLevel = document.getElementById("evoLevel").value;
  const spAtkMin = document.getElementById("spAtkMin").value;
  const spAtkMax = document.getElementById("spAtkMax").value;
  const spDefMin = document.getElementById("spDefMin").value;
  const spDefMax = document.getElementById("spDefMax").value;
  const speedMin = document.getElementById("speedMin").value;
  const speedMax = document.getElementById("speedMax").value;
  const gender = document.getElementById("genderSelect").value;
  const sortBy = document.getElementById("sortBy").value;
  const sortOrder = document.getElementById("sortOrder").value;

  let url = `${BASE_URL}/filter?`;

  if (checkedTypes.length > 0) url += `types=${checkedTypes.join(",")}&`;
  if (attackMin) url += `attackMin=${attackMin}&`;
  if (attackMax) url += `attackMax=${attackMax}&`;
  if (hpMin) url += `hpMin=${hpMin}&`;
  if (hpMax) url += `hpMax=${hpMax}&`;
  if (evolutionCount) url += `evo=${evolutionCount}&`;
  if (weightMin) url += `weightMin=${weightMin}&`;
  if (weightMax) url += `weightMax=${weightMax}&`;
  if (heightMin) url += `heightMin=${heightMin}&`;
  if (heightMax) url += `heightMax=${heightMax}&`;
  if (evoLevel) url += `evoLevel=${evoLevel}&`;
  if (spAtkMin) url += `spAtkMin=${spAtkMin}&`;
  if (spAtkMax) url += `spAtkMax=${spAtkMax}&`;
  if (spDefMin) url += `spDefMin=${spDefMin}&`;
  if (spDefMax) url += `spDefMax=${spDefMax}&`;
  if (speedMin) url += `speedMin=${speedMin}&`;
  if (speedMax) url += `speedMax=${speedMax}&`;
  if (gender) url += `gender=${gender}&`;
  if (sortBy) url += `sortBy=${sortBy}&`;
  if (sortOrder) url += `sortOrder=${sortOrder}&`;

  chargerPokemons(url);
});

// Bouton Reset Filters
document.getElementById("resetFilters").addEventListener("click", () => {
  // Reset types cochés
  document
    .querySelectorAll("input[name='typeFilter']:checked")
    .forEach((c) => (c.checked = false));

  // Reset tous les inputs numériques
  document
    .querySelectorAll("input[type='number']")
    .forEach((i) => (i.value = ""));

  // Reset tous les selects
  document.querySelectorAll("#filters select").forEach((s) => (s.value = ""));

  // Reset champ recherche
  document.getElementById("nameSearch").value = "";

  // Recharge tout le pokédex complet
  chargerPokemons();
});

// afficher tous les pokemons au démarrage
document
  .getElementById("loadBtn")
  .addEventListener("click", () => chargerPokemons());
chargerPokemons(); // à l'ouverture

// Recherche par nom
const inputRecherche = document.getElementById("nameSearch");
inputRecherche.addEventListener("input", async () => {
  // trim permet de supprimer les espaces avant et après la saisie de l'utilisateur
  const recherche = inputRecherche.value.trim();

  // Si le champ est vide -> remet les recherches via filtres
  if (recherche.length === 0) {
    document.getElementById("filterBtn").click();
    return;
  }

  // Construction de l'URL pour la recherche + filtres actuels
  let urlSearch = `${BASE_URL}/search?name=${recherche}&lang=${selectLang.value}`;

  // Ajout automatique des filtres déjà présents dans l'UI
  const checkedTypes = Array.from(
    document.querySelectorAll("input[name='typeFilter']:checked")
  ).map((c) => c.value);
  if (checkedTypes.length > 0) urlSearch += `&types=${checkedTypes.join(",")}`;

  const sortBy = document.getElementById("sortBy").value;
  const sortOrder = document.getElementById("sortOrder").value;
  if (sortBy) urlSearch += `&sortBy=${sortBy}`;
  if (sortOrder) urlSearch += `&sortOrder=${sortOrder}`;

  try {
    const reponse = await fetch(urlSearch);
    const resultats = await reponse.json();
    const conteneur = document.getElementById("pokemon-container");
    conteneur.innerHTML = "";

    if (resultats.length === 0) {
      conteneur.innerHTML = "<p>Aucun Pokémon trouvé.</p>";
      return;
    }

    resultats.forEach((pokemon) => {
      const carte = document.createElement("div");
      carte.className = "pokemon-card";
      carte.innerHTML = `
        <h3>${pokemon.name[currentLang]}</h3>
        <img src="${pokemon.image.sprite}" alt="${pokemon.name[currentLang]}">
        <p>Type: ${pokemon.type.join(", ")}</p>
      `;

      // Même redirection sur les résultats de recherche
      carte.addEventListener("click", () => {
        window.location.href = `pokemon.html?id=${pokemon._id}&lang=${currentLang}`;
      });

      conteneur.appendChild(carte);
    });
  } catch (erreur) {
    console.error("Erreur recherche Pokémon :", erreur);
  }
});
