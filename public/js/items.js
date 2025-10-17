async function chargerItems() {
const filtreType = document.getElementById('typeFilter').value;

const urlAPI= filtreType ? `http://localhost:3000/items?type=${filtreType}`:'http://localhost:3000/items'; // Remember IF/ELSE


  try {
    const reponse = await fetch(urlAPI);
    const listeItems = await reponse.json(); // request json 
    const conteneur = document.getElementById('item-container'); //select le con teneur et le vider (pour ajout nouvelles cartes)
    conteneur.innerHTML = '';

    listeItems.forEach(item => {
      const carte = document.createElement('div');
      carte.className = 'item-card';
      carte.innerHTML = `
        <h3>${item.name.english}</h3>
        <p>Description : ${item.description}</p>
        <p>Type : ${item.type}</p>
      `;

      //Clic sur une carte → redirige vers /item/:id
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
chargerItems();