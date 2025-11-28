// URL de base pour l'API
const BASE_URL = 'http://localhost:3000/items';

async function chargerItems() {
  const filtreType = document.getElementById('typeFilter').value; //recup type saisi EN ANGLAIS
  const nomRecherche = document.getElementById('nameSearch').value.trim(); // recup nom saisi
  const descRecherche = document.getElementById('descSearch').value.trim(); // recup description saisi

  // Construction dynamique de l'URL selon le filtre type et la recherche par nom
  let url = `${BASE_URL}`;
  const params = [];
  if (filtreType) params.push(`type=${filtreType}`);
  if (nomRecherche) params.push(`name=${nomRecherche}`);
  if (descRecherche) params.push(`description=${descRecherche}`);
  if (params.length > 0) url += `?${params.join('&')}`;

  try {
    const reponse = await fetch(url);
    const listeItems = await reponse.json(); // request json 
    const conteneur = document.getElementById('item-container'); 
    conteneur.innerHTML = '';

    listeItems.forEach(item => {
      const carte = document.createElement('div');
      carte.className = 'item-card';
      carte.innerHTML = `
        <h3>${item.name.english || item.name}</h3>
        <p>Description : ${item.description}</p>
        <p>Type : ${item.type}</p>
      `;

      // Clique sur une carte et redirige vers la page détail due l'item
      carte.addEventListener('click', () => {
        window.location.href = `item.html?id=${item._id}`;
      });

      conteneur.appendChild(carte);
    });

  } catch (erreur) {
    console.error('erreurlaod item :', erreur);
  }
}

document.getElementById('loadBtn').addEventListener('click', chargerItems);
chargerItems(); // à l'"ouverture

// Recherche par nom
const inputRecherche = document.getElementById('nameSearch');
inputRecherche.addEventListener('input', async () => {
  // trim permet de supprimer les espaces avant et après la saisie de l'utilisateur
  const recherche = inputRecherche.value.trim(); 
  const filtreType = document.getElementById('typeFilter').value; // garder le type sélectionné
  const descRecherche = document.getElementById('descSearch').value.trim(); // recup description saisi

  // Si le champ est vide on recharge UNIQUEMENT avec le filtre type
  if (recherche.length === 0) {
    chargerItems(); // cette fonction gère déjà le type
    return;
  }

  // Construction de l'URL pour la recherche (on garde le type si présent)
  let urlSearch = `${BASE_URL}/search?name=${recherche}`;
  if (filtreType) {
    urlSearch += `&type=${filtreType}`;
  }
  if (descRecherche) {
    urlSearch += `&description=${descRecherche}`;
  }

  try {
    const reponse = await fetch(urlSearch);
    const resultats = await reponse.json();
    const conteneur = document.getElementById('item-container');
    conteneur.innerHTML = '';

    if (resultats.length === 0) {
      conteneur.innerHTML = '<p>Aucun item trouvé.</p>';
      return;
    }

    resultats.forEach(item => {
      const carte = document.createElement('div');
      carte.className = 'item-card';
      carte.innerHTML = `
        <h3>${item.name.english}</h3>
        <p>Description : ${item.description}</p>
        <p>Type : ${item.type}</p>
      `;

      // Même redirection sur les résultats de recherche
      carte.addEventListener('click', () => {
        window.location.href = `item.html?id=${item._id}`;
      });

      conteneur.appendChild(carte);
    });

  } catch (erreur) {
    console.error('Erreur recherche item :', erreur);
  }
});

async function chargerTypes() {
  try {
    const reponse = await fetch("http://localhost:3000/items");
    const items = await reponse.json();
    const select = document.getElementById('typeFilter');
    const typesUniques = [];
    items.forEach(item => {
      if (!typesUniques.includes(item.type)) { // si le type n’est pas déjà dans le tableau
        typesUniques.push(item.type);          // on l’ajoute
        const option = document.createElement('option');
        option.value = item.type;
        option.textContent = item.type;
        select.appendChild(option);
      }
    });
  }catch (err) {
    console.error('Erreur chargement items :', err);
  }
}
chargerTypes();
