const params = new URLSearchParams(window.location.search); // récupère les param de l'URL
const id = params.get('id');
const lang = params.get('lang') || 'fr'; 

fetch(`/pokemon/${id}`)
  .then(res => res.json()) // transformer la réponse en JSON
  .then(pokemon => {
    const conteneur = document.getElementById('pokemon-detail');

async function chargerPokemon() {
  try {
    const res = await fetch(`/pokemon/${id}`);
    if (!res.ok) throw new Error('Pokémon introuvable');
    const pokemon = await res.json();

     // Utilise la langue choisie dans le Pokédex (french, english, japanese, chinese)
    const nomAffiche = pokemon.name[lang] || pokemon.name.french; 

    let contenu = `<h1>${nomAffiche}</h1>`;
    contenu += `<img src="${pokemon.image.sprite}" alt="${pokemon.name.french}" style="width:120px;">`;
    contenu += '<ul>';

    // parcours des clés de l'objet pokemon
    const cles = Object.keys(pokemon);

    for (let i = 0; i < cles.length; i++) { // boucle sur les clés
      const cle = cles[i]; // clé courante
      const valeur = pokemon[cle]; // valeur associée à la clé
      let texteValeur; // variable pour stocker le texte à afficher

      // si la valeur est un objet ou un tableau, on ne fait pas ça sinon on obtient [object Object]
      if (typeof valeur==='object' && valeur!== null) { 
        texteValeur = '<pre>' + JSON.stringify(valeur, null,2) + '</pre>';  //formatage 
      } else {
        texteValeur = valeur; // sinon juste print la valeur
      }

      contenu += '<li><strong>' + cle + '</strong> : ' + texteValeur + '</li>'; // ajoute à la liste
    }

    contenu += '</ul>';
    contenu += '<a href="/pokedex.html" style="display:inline-block;margin-top:20px;">← Retour aux pokemons</a>';  
    // lien retour
    conteneur.innerHTML = contenu;

    // création dynamique des champs du formulaire
    updateForm.innerHTML = '';
    Object.keys(pokemon).forEach(cle => { 
      const valeur = pokemon[cle];
      let input; // champ de saisie

      if (typeof valeur === 'object' && valeur !== null) { // pour les objets et tableaux
        input = document.createElement('textarea'); // utilise une textarea
        input.value = JSON.stringify(valeur, null, 2); // formatage JSON
      } else { // pour les types normaux genre string number boolean
        input = document.createElement('input'); // champ texte simple
        input.value = valeur;
      }

      input.id = 'update_' + cle; // identifiant unique, on utilise ça pour récupérer les valeurs plus tard
      // un champ ressemble à ça : <input id="update_name" value="Medicine">
      input.placeholder = cle; // placeholder
      input.style.display = 'block'; 
      input.style.marginBottom = '8px';

      const label = document.createElement('label');
      label.textContent = cle; // nom de la clé
      label.style.display = 'block';
      label.style.marginTop = '8px';

      updateForm.appendChild(label);
      updateForm.appendChild(input);
    });

    // ajouter le bouton enregistrer à la fin du formulaire
    const saveBtn = document.createElement('button');
    saveBtn.id = 'saveBtn';
    saveBtn.textContent = 'Enregistrer';
    updateForm.appendChild(saveBtn);

    // toggle du formulaire
    document.getElementById('updateBtn').addEventListener('click', () => {
      if (updateForm.style.display==='none') {
        updateForm.style.display='block';
      } else {
        updateForm.style.display='none'; 
      }
    });

      saveBtn.addEventListener('click', () => {
      // reconstruction de l'objet updatedPokemon à partir des inputs
      const updatedPokemon = {};

      // parcours de tous les inputs / textarea créés
      updateForm.querySelectorAll('input[id^="update_"], textarea[id^="update_"]').forEach(input => {
        const key = input.id.replace('update_', ''); // ex: name.english
        const keys = key.split('.');
        let obj = updatedPokemon;


        // GENERE PAR IA

        // créé les objets intermédiaires
        for (let i = 0; i < keys.length - 1; i++) {
          if (!obj[keys[i]]) obj[keys[i]] = {};
          obj = obj[keys[i]];
        }

        const finalKey = keys[keys.length - 1];

        // si le champ était marqué comme 'json' => obliger à JSON.parse
        if (input.dataset.type === 'json') {
          try {
            obj[finalKey] = JSON.parse(input.value);
          } catch (e) {
            alert(`Le champ "${key}" contient du JSON invalide : ${e.message}`);
            throw new Error(`JSON invalide dans ${key}`); // stoppe la boucle et empêche fetch
          }
        } else {
          // on essaye JSON.parse pour capturer true/false/nombres si l'utilisateur a laissé "123" ou "true"
          try {
            const parsed = JSON.parse(input.value);
            // parsed peut être string si l'utilisateur a mis "foo" (non JSON) -> JSON.parse échouera
            obj[finalKey] = parsed;
          } catch {
            // si parse échoue, on garde en string (préserve le comportement si c'est littéral)
            obj[finalKey] = input.value;
          }
        }
      });
      // Sécurité : ne jamais envoyer de _id au serveur 
      if (updatedPokemon._id) delete updatedPokemon._id;


      fetch(`/pokemon/${id}`, { // envoie la requête put
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPokemon) // corps de la requête
      })
      .then(res => res.json())
      .then(data => {
        alert(data.message); // alerte message de succès (ou erreur)
        window.location.reload();
      })
      .catch(err => console.error('erreur mise à jour:', err));
    });

    // suppression de l'attaque
    document.getElementById('deleteBtn').addEventListener('click', () => {
      if (confirm('sûr de supprimer cette attaque ?')) {
        fetch(`/pokemon/${id}`, { method: 'DELETE' })
          .then(res => res.json())
          .then(data => {
            alert(data.message);
            window.location.href = '/pokedex.html';
          })
          .catch(err => console.error('erreur suppression pokemon :', err));
      }
    });

  })
  .catch(err => console.error('erreur chargement pokemon :', err));
