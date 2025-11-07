async function chargerTypes() {
  const filtreType = document.getElementById('typeFilter') ? document.getElementById('typeFilter').value.trim() : '';

  try {
    const reponse = await fetch("http://localhost:3000/types");
    const listeTypes = await reponse.json(); // request json 
    const conteneur = document.getElementById('types-container'); 
    conteneur.innerHTML = '';

    listeTypes
      .filter(type => !filtreType || type.english.toLowerCase().includes(filtreType.toLowerCase()))
      .forEach(type => {
        const carte = document.createElement('div');
        carte.className='type-card';

        carte.innerHTML=
          `<h3>${type.english}</h3>
          <p>Effective: ${type.effective.join(', ')}</p>
          <p>Ineffective: ${type.ineffective.join(', ')}</p>
          <p>No Effect: ${type.no_effect.join(', ')}</p>`;

        // Clic
        // voir le détail du type
        carte.addEventListener('click', () => {
          window.location.href = `type.html?id=${type._id}`;
        });

        conteneur.appendChild(carte);
      });

  } catch (erreur) {
    console.error('erreurlaod types :', erreur);
  }
}

document.getElementById('loadBtn').addEventListener('click', chargerTypes);
chargerTypes(); // à l'ouverture

// Recherche en direct si tu as un input pour filtrer
const inputRecherche = document.getElementById('typeFilter');
if (inputRecherche) {
  inputRecherche.addEventListener('input', () => {
    chargerTypes();
  });
}
