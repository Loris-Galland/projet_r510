const express = require('express');
const router = express.Router();
const { getDb } = require('../db/mongo');

// GET /items
// récupérer tous les items ou seulement ceux d'un type précis
// (peut aussi filtrer par nom si ?name= est présent)
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection('items');
    const typeQuery = req.query.type; // lecture du "type" dans url
    const nameQuery = req.query.name; // lecture du "nom" dans url
    const descQuery = req.query.description; 
    let query = {};

    // Si un type est demandé, on filtre dessus
    if (typeQuery) {
      query.type = { $regex: new RegExp(`^${typeQuery}$`, 'i') };
    }

    // Si un nom est demandé, on filtre aussi par nom français
    if (nameQuery) {
      query['name.english'] = { $regex: `^${nameQuery}`, $options: 'i' };
    }
    // Si une description est demandée, on filtre aussi par description
    // en séparant les mots-clés par des espaces
    if (descQuery) {
      const mots = descQuery.trim().split(/\s+/); // sépare par espaces
      query.$and = mots.map(mot => ({
      'description': { $regex: mot, $options: 'i' }
    }));
}

    const items = await collection.find(query).toArray(); //exec request + conversion en tab
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send('erreur serveur');
  }
});


// GET /items/search
// rechercher les Items dont le nom commence par certaines lettres
// (et optionnellement filtrer par type en même temps)
router.get('/search', async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection('items');
    const nameQuery = req.query.name || '';
    const typeQuery = req.query.type || ''; // on lit aussi le type s’il est présent dans l’URL
    const descQuery = req.query.description || '';

    if (nameQuery.trim() === '') {
      return res.json([]);
    }

    // Construction dynamique du filtre combiné
    const query = {
      'name.english': { $regex: `^${nameQuery}`, $options: 'i' }
    };

    // Si un type est aussi présent, on le combine dans la recherche
    if (typeQuery) {
      query.type = { $regex: new RegExp(`^${typeQuery}$`, 'i') };
    }

    if (descQuery) {
      const mots = descQuery.trim().split(/\s+/);

      query.$and = mots.map(mot => ({
     'description': { $regex: mot, $options: 'i' }
    }));
}


    const items = await collection.find(query).toArray();

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send('erreur serveur (search)');
  }
});


module.exports = router;