// URL de base pour l'API
const BASE_URL = 'http://localhost:3000/pokedex';

async function chargerPokemons() {
  const filtreType = document.getElementById('typeFilter').value; //recup type saisi EN ANGLAIS

  // Construction dynamique de l'URL selon le filtre
  const url = filtreType ? `${BASE_URL}?type=${filtreType}` : BASE_URL;

  try {
    const reponse = await fetch(url);
    const listePokemons = await reponse.json(); // request json 
    const conteneur = document.getElementById('pokemon-container'); 
    conteneur.innerHTML = '';

    listePokemons.forEach(pokemon => {
      const carte = document.createElement('div');
      carte.className = 'pokemon-card';

      carte.innerHTML =
        `<h3>${pokemon.name.french}</h3>
        <img src="${pokemon.image.sprite}" alt="${pokemon.name.french}">
        <p>Type: ${pokemon.type.join(', ')}</p>`;
      conteneur.appendChild(carte);
    });

  } catch (erreur) {
    console.error('erreurlaod pokemon :', erreur);
  }
}

document.getElementById('loadBtn').addEventListener('click', chargerPokemons);
chargerPokemons(); // à l'"ouverture

// Recherche par nom
const inputRecherche = document.getElementById('nameSearch');
inputRecherche.addEventListener('input', async () => {
  // trim permet de supprimer les espaces avant et après la saisie de l'utilisateur
  const recherche = inputRecherche.value.trim(); 

  if (recherche.length === 0) {
    // Si champ vide -> recharger tout le pokédex
    chargerPokemons();
    return;
  }

  // Construction de l'URL pour la recherche
  const urlSearch = `${BASE_URL}/search?name=${recherche}`;

  try {
    const reponse = await fetch(urlSearch);
    const resultats = await reponse.json();
    const conteneur = document.getElementById('pokemon-container');
    conteneur.innerHTML = '';

    if (resultats.length === 0) {
      conteneur.innerHTML = '<p>Aucun Pokémon trouvé.</p>';
      return;
    }

    resultats.forEach(pokemon => {
      const carte = document.createElement('div');
      carte.className = 'pokemon-card';
      carte.innerHTML = `
        <h3>${pokemon.name.french}</h3>
        <img src="${pokemon.image.sprite}" alt="${pokemon.name.french}">
        <p>Type: ${pokemon.type.join(', ')}</p>`;
      conteneur.appendChild(carte);
    });

  } catch (erreur) {
    console.error('Erreur recherche Pokémon :', erreur);
  }
});
