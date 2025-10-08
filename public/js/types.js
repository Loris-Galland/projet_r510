async function chargerTypes() {
  const filtreType = document.getElementById('typeFilter').value; //recup type saisi EN ANGLAIS

  try {
    const reponse = await fetch("http://localhost:3000/types");
    const listeTypes = await reponse.json(); // request json 
    const conteneur = document.getElementById('types-container'); 
    conteneur.innerHTML = '';

    listeTypes.forEach(type => {
      const carte = document.createElement('div');
      carte.className='type-card';

      carte.innerHTML=
        `<h3>${type.english}</h3>
        <p>Effective: ${type.effective.join(', ')}</p>
        <p>Ineffective: ${type.ineffective.join(', ')}</p>
        <p>No Effect: ${type.no_effect.join(', ')}</p>`


      conteneur.appendChild(carte);
    });

  } catch (erreur) {
    console.error('erreurlaod types :', erreur);
  }
}

document.getElementById('loadBtn').addEventListener('click', chargerTypes);
chargerTypes(); // à l'"ouverture
