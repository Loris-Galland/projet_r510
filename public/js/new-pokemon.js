document.getElementById('newPokemonForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Récupération des valeurs du formulaire
  const pokemon = {
    id: Date.now(), // petit id unique basique (ou géré par Mongo)
    name: {
      french: document.getElementById('nameFrench').value.trim(),
      english: document.getElementById('nameEnglish').value.trim() || ''
    },
    type: document.getElementById('types').value.split(',').map(t => t.trim()),
    base: {
      HP: Number(document.getElementById('hp').value),
      Attack: Number(document.getElementById('attack').value),
      Defense: Number(document.getElementById('defense').value)
    },
    description: document.getElementById('description').value.trim(),
    image: {
      sprite: document.getElementById('sprite').value.trim() || '/img/default.png'
    }
  };

  try {
    const res = await fetch('http://localhost:3000/new-pokemon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pokemon)
    });

    const data = await res.json();

    if (res.ok) {
      alert('Pokémon ajouté avec succès !');
      window.location.href = '/pokedex.html';
    } else {
      alert('Erreur : ' + data.message);
    }
  } catch (err) {
    console.error('Erreur création Pokémon :', err);
    alert('Erreur serveur lors de la création');
  }
});
