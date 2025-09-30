async function chargerPokemons() {
  const filtreType = document.getElementById('typeFilter').value; //recup type saisi EN ANGLAIS

  const urlAPI= filtreType ? `http://localhost:3000/pokedex?type=${filtreType}`:'http://localhost:3000/pokedex';

  try {
    const reponse = await fetch(urlAPI);
    const listePokemons = await reponse.json(); // request json 
    const conteneur = document.getElementById('pokemon-container'); //select le con teneur et le vider (pour ajout nouvelles cartes)
    conteneur.innerHTML = '';

    listePokemons.forEach(pokemon => {
      const carte = document.createElement('div');
      carte.className='pokemon-card';

      carte.innerHTML=
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
