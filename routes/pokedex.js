const express = require('express');
const router = express.Router();
const { getDb } = require('../db/mongo'); // recupérer la connexion mongoDB

// GET /pokedex
// récupérer tous les Pokémon ou seulement ceux d'un type précis
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection('pokedex');
    const typeQuery = req.query.type; // lecture du "type" dans url
    let query = {};

    if (typeQuery) {
      query = {type:{$elemMatch:{$regex: new RegExp(`^${typeQuery}$`,'i')}}};
    }

    const pokemons = await collection.find(query).toArray(); //exec request + conversion en tab
    res.json(pokemons);
  } catch (err) {
    console.error(err);
    res.status(500).send('erreur serveur');
  }
});

// permet à ce router d'être utilisé dans server.js
module.exports = router;
