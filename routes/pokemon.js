const express = require('express');
const router = express.Router();
const { getDb } = require('../db/mongo'); // recupérer la connexion mongoDB
const { ObjectId } = require('mongodb');

// GET /pokemon/:id
// Récupère les détails d'un Pokémon selon son ID MongoDB
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection('pokedex');
    const { id } = req.params;

    const pokemon = await collection.findOne({ _id: new ObjectId(id) });

    if (!pokemon) {
      return res.status(404).send('Pokémon introuvable');
    }

    res.json(pokemon);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur (get Pokémon)');
  }
});

module.exports = router;
