// URL de base pour l'API
const BASE_URL = 'http://localhost:3000/moves';

async function chargerMoves() {
  const filtreType = document.getElementById('typeFilter').value; //recup type saisi EN ANGLAIS
  const nomRecherche = document.getElementById('nameSearch').value.trim(); // recup nom saisi

  // Construction dynamique de l'URL selon le filtre type et la recherche par nom
  let url = `${BASE_URL}`;
  const params = [];
  if (filtreType) params.push(`type=${filtreType}`);
  if (nomRecherche) params.push(`name=${nomRecherche}`);
  if (params.length > 0) url += `?${params.join('&')}`;

  try {
    const reponse = await fetch(url);
    const listeMoves = await reponse.json(); // request json 
    const conteneur = document.getElementById('moves-container'); 
    conteneur.innerHTML = '';

    listeMoves.forEach(move => {
      const carte = document.createElement('div');
      carte.className = 'move-card';
      carte.innerHTML=
        `<h3>${move.ename}</h3>
        <p>Type: ${move.type}</p>`;
      

      // Clique sur une carte et redirige vers la page détail du move
      carte.addEventListener('click', () => {
        window.location.href = `move.html?id=${move._id}`;
      });

      conteneur.appendChild(carte);
    });

  } catch (erreur) {
    console.error('erreurlaod move :', erreur);
  }
}

document.getElementById('loadBtn').addEventListener('click', chargerMoves);
chargerMoves(); // à l'"ouverture

// Recherche par nom
const inputRecherche = document.getElementById('nameSearch');
inputRecherche.addEventListener('input', async () => {
  // trim permet de supprimer les espaces avant et après la saisie de l'utilisateur
  const recherche = inputRecherche.value.trim(); 
  const filtreType = document.getElementById('typeFilter').value; // garder le type sélectionné

  // Si le champ est vide on recharge UNIQUEMENT avec le filtre type
  if (recherche.length === 0) {
    chargerMoves(); // cette fonction gère déjà le type
    return;
  }

  // Construction de l'URL pour la recherche (on garde le type si présent)
  let urlSearch = `${BASE_URL}/search?name=${recherche}`;
  if (filtreType) {
    urlSearch += `&type=${filtreType}`;
  }

  try {
    const reponse = await fetch(urlSearch);
    const resultats = await reponse.json();
    const conteneur = document.getElementById('moves-container');
    conteneur.innerHTML = '';

    if (resultats.length === 0) {
      conteneur.innerHTML = '<p>Aucun move trouvé.</p>';
      return;
    }

    resultats.forEach(move => {
      const carte = document.createElement('div');
      carte.className = 'move-card';
      carte.innerHTML=
        `<h3>${move.ename}</h3>
        <p>Type: ${move.type}</p>`;
      ;

      // Même redirection sur les résultats de recherche
      carte.addEventListener('click', () => {
        window.location.href = `move.html?id=${move._id}`;
      });

      conteneur.appendChild(carte);
    });

  } catch (erreur) {
    console.error('Erreur recherche move :', erreur);
  }
});
