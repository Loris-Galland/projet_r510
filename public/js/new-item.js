document.getElementById('newItemForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Récupération des valeurs du formulaire
  const item = {
    id: Date.now(), // petit id unique basique (ou géré par Mongo)
    name: {
      english: document.getElementById('nameEnglish').value.trim()
    },
    type: document.getElementById('type').value.trim(),
    description: document.getElementById('description').value.trim(),
  };

  try {
    const res = await fetch('http://localhost:3000/new-item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });

    const data = await res.json();

    if (res.ok) {
      alert('Item ajouté avec succès !');
      window.location.href = '/items.html';
    } else {
      alert('Erreur : ' + data.message);
    }
  } catch (err) {
    console.error('Erreur création item :', err);
    alert('Erreur serveur lors de la création');
  }
});
