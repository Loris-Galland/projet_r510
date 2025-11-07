// Récupère l'ID du type depuis l'URL
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

fetch(`/types/${id}`)
  .then(res => res.json())
  .then(type => {
    const conteneur = document.getElementById('type-detail');
    let contenu = `<h1>${type.english}</h1>`;
    contenu += '<ul>';

    Object.keys(type).forEach(key => {
      let valeur = type[key];
      if (typeof valeur === 'object' && valeur !== null) {
        valeur = '<pre>' + JSON.stringify(valeur, null, 2) + '</pre>';
      }
      contenu += `<li><strong>${key}</strong>: ${valeur}</li>`;
    });

    contenu += '</ul>';
    conteneur.innerHTML = contenu;

    // bouton delete
    const deleteBtn = document.getElementById('deleteBtn');
    deleteBtn.style.display = 'inline-block';
    deleteBtn.addEventListener('click', async () => {
      if (!confirm('Supprimer ce type ?')) return;
      const res = await fetch(`/types/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Type supprimé !');
        window.location.href = '/types.html';
      } else {
        alert('Erreur lors de la suppression');
      }
    });
  })
  .catch(err => console.error('Erreur chargement type :', err));
