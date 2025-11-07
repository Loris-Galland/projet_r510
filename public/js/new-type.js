// Formulaire création type
document.getElementById('newTypeForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const type = {
    english: document.getElementById('nameEnglish').value.trim(),
    effective: document.getElementById('effective').value.split(',').map(t => t.trim()),
    ineffective: document.getElementById('ineffective').value.split(',').map(t => t.trim()),
    no_effect: document.getElementById('noEffect').value.split(',').map(t => t.trim())
  };

  try {
    const res = await fetch('http://localhost:3000/types', {
      method: 'POST', // CREATE /types
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
    console.error('Erreur création Type :', err);
    alert('Erreur serveur lors de la création');
  }
});
