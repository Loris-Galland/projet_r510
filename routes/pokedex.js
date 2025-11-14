const express = require('express');
const router = express.Router();
const { getDb } = require('../db/mongo'); // recupérer la connexion mongoDB

// GET /pokedex
// récupérer tous les Pokémon ou seulement ceux d'un type précis
// (peut aussi filtrer par nom si ?name= est présent)
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection('pokedex');
    const typeQuery = req.query.type; // lecture du "type" dans url
    const nameQuery = req.query.name; // lecture du "nom" dans url
    let query = {};

    // Si un type est demandé, on filtre dessus
    if (typeQuery) {
      query.type = { $elemMatch: { $regex: new RegExp(`^${typeQuery}$`, 'i') } };
    }

    // Si un nom est demandé, on filtre aussi par nom français
    if (nameQuery) {
      query['name.french'] = { $regex: `^${nameQuery}`, $options: 'i' };
    }

    const pokemons = await collection.find(query).toArray(); //exec request + conversion en tab
    res.json(pokemons);
  } catch (err) {
    console.error(err);
    res.status(500).send('erreur serveur');
  }
});

// GET /pokedex/search
// rechercher les Pokémon dont le nom commence par certaines lettres
// (et optionnellement filtrer par type en même temps)
router.get('/search', async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection('pokedex');
    const nameQuery = req.query.name || '';
    const typeQuery = req.query.type || ''; // on lit aussi le type s’il est présent dans l’URL

    if (nameQuery.trim() === '') {
      return res.json([]);
    }

    // Construction dynamique du filtre combiné
    const query = {
      'name.french': { $regex: `^${nameQuery}`, $options: 'i' }
    };

    // Si un type est aussi présent, on le combine dans la recherche
    if (typeQuery) {
      query.type = { $elemMatch: { $regex: new RegExp(`^${typeQuery}$`, 'i') } };
    }

    const pokemons = await collection.find(query).toArray();

    res.json(pokemons);
  } catch (err) {
    console.error(err);
    res.status(500).send('erreur serveur (search)');
  }
});

// permet à ce router d'être utilisé dans server.js
module.exports = router;
