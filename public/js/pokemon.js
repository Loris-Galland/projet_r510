// Récupère l'ID du Pokémon depuis l'URL (ex: pokemon.html?id=xxxx)
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const conteneur = document.getElementById('pokemon-detail');
const deleteBtn = document.getElementById('deleteBtn');

async function chargerPokemon() {
  try {
    const res = await fetch(`/pokemon/${id}`);
    if (!res.ok) throw new Error('Pokémon introuvable');
    const pokemon = await res.json();

    let contenu = `<h1>${pokemon.name.french}</h1>`;
    contenu += `<img src="${pokemon.image.sprite}" alt="${pokemon.name.french}" style="width:120px;">`;
    contenu += '<ul>';

    const cles = Object.keys(pokemon);
    for (let i = 0; i < cles.length; i++) {
      const cle = cles[i];
      const valeur = pokemon[cle];
      let texteValeur;

      if (typeof valeur === 'object' && valeur !== null) {
        texteValeur = '<pre>' + JSON.stringify(valeur, null, 2) + '</pre>';
      } else {
        texteValeur = valeur;
      }

      contenu += '<li><strong>' + cle + '</strong> : ' + texteValeur + '</li>';
    }
    contenu += '</ul>';
    conteneur.innerHTML = contenu;

    // Affiche le bouton supprimer maintenant que le Pokémon est chargé
    deleteBtn.style.display = 'inline-block';

  } catch (err) {
    console.error('Erreur chargement Pokémon :', err);
    conteneur.innerHTML = '<p>Erreur lors du chargement du Pokémon.</p>';
  }
}

// Fonction pour supprimer le Pokémon
deleteBtn.addEventListener('click', async () => {
  if (!confirm('Voulez-vous vraiment supprimer ce Pokémon ?')) return;

  try {
    const res = await fetch(`/pokemon/${id}`, {
      method: 'DELETE'
    });

    const data = await res.json();

    if (res.ok) {
      alert('Pokémon supprimé avec succès !');
      window.location.href = '/pokedex.html'; // retour au Pokédex
    } else {
      alert('Erreur : ' + data.message);
    }
  } catch (err) {
    console.error('Erreur suppression Pokémon :', err);
    alert('Erreur serveur lors de la suppression');
  }
});

// Charger le Pokémon au démarrage
chargerPokemon();
