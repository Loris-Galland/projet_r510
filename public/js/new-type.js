document.getElementById('newTypeForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Récupération des valeurs du formulaire
  const type = {
    english: document.getElementById('english').value.trim(),
    chinese: document.getElementById('chinese').value.trim(),
    japanese: document.getElementById('japanese').value.trim(),

    // Tableaux séparés par virgules
    effective: document.getElementById('effective').value
      .split(',')
      .map(x => x.trim())
      .filter(Boolean),

    ineffective: document.getElementById('ineffective').value
      .split(',')
      .map(x => x.trim())
      .filter(Boolean),

    no_effect: document.getElementById('no_effect').value
      .split(',')
      .map(x => x.trim())
      .filter(Boolean),
  };

  try {
    const res = await fetch('http://localhost:3000/new-type', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(type)
    });

    const data = await res.json();

    if (res.ok) {
      alert('Type ajouté avec succès !');
      window.location.href = '/types.html';
    } else {
      alert('Erreur : ' + data.message);
    }
  } catch (err) {
    console.error('Erreur création type :', err);
    alert('Erreur serveur lors de la création');
  }
});