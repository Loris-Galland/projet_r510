const form = document.getElementById('newPokemonForm');
form.addEventListener('submit', async e => {
  e.preventDefault();

  const pokemon = {
    _id: document.getElementById('_id').value.trim() || undefined,
    id: Number(document.getElementById('pokeId').value) || Date.now(),
    name: {
      french: document.getElementById('nameFrench').value.trim(),
      english: document.getElementById('nameEnglish').value.trim() || '',
      japanese: document.getElementById('nameJapanese').value.trim() || '',
      chinese: document.getElementById('nameChinese').value.trim() || ''
    },
    type: document.getElementById('types').value.split(',').map(t => t.trim()),
    base: {
      HP: Number(document.getElementById('hp').value),
      Attack: Number(document.getElementById('attack').value),
      Defense: Number(document.getElementById('defense').value),
      "Sp. Attack": Number(document.getElementById('spAttack').value) || 0,
      "Sp. Defense": Number(document.getElementById('spDefense').value) || 0,
      Speed: Number(document.getElementById('speed').value) || 0,
      species: document.getElementById('species').value.trim() || ''
    },
    description: document.getElementById('description').value.trim(),
    evolution: {
      next: JSON.parse(document.getElementById('evolutionNext').value || '[]')
    },
    profile: {
      height: document.getElementById('height').value.trim(),
      weight: document.getElementById('weight').value.trim()
    },
    egg: document.getElementById('egg').value.split(',').map(e => e.trim()),
    ability: JSON.parse(document.getElementById('ability').value || '[]'),
    gender: document.getElementById('gender').value.trim(),
    image: {
      sprite: document.getElementById('sprite').value.trim() || '/img/default.png',
      thumbnail: document.getElementById('thumbnail').value.trim() || '',
      hires: document.getElementById('hires').value.trim() || ''
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
