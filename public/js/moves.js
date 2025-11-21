async function chargerMoves() {
  const filtreType = document.getElementById('typeFilter').value; //recup type saisi EN ANGLAIS

  const urlAPI= filtreType ? `http://localhost:3000/moves?type=${filtreType}`:'http://localhost:3000/moves';

  try {
    const reponse = await fetch(urlAPI);
    const listeMoves = await reponse.json(); // request json 
    const conteneur = document.getElementById('moves-container'); 
    conteneur.innerHTML = '';

    listeMoves.forEach(move => {
      const carte = document.createElement('div');
      carte.className='move-card';

      carte.innerHTML=
        `<h3>${move.ename}</h3>
        <p>Type: ${move.type}</p>`;
      ;

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
