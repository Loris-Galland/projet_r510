document.getElementById('newMoveForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Récupération des valeurs du formulaire
  const move = {
    id: Date.now(), // petit id unique basique (ou géré par Mongo)
    ename: document.getElementById('nameEnglish').value.trim(),
    cname: document.getElementById('nameChinese').value.trim() || '',
    jname: document.getElementById('nameJapanese').value.trim() || '',
    type: document.getElementById('type').value.trim(),
    power: document.getElementById('power').value.trim(),
    pp : document.getElementById('pp').value.trim(), // le trim pour enlever les espaces inutiles
    accuracy: document.getElementById('accuracy').value.trim(),
  };

  try {
    const res = await fetch('http://localhost:3000/new-move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(move)
    });

    const data = await res.json();

    if (res.ok) {
      alert('Attaque ajoutée avec succès !');
      window.location.href = '/moves.html';
    } else {
      alert('Erreur : ' + data.message);
    }
  } catch (err) {
    console.error('Erreur création move :', err);
    alert('Erreur serveur lors de la création');
  }
});
