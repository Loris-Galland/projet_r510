const express = require('express');
const router = express.Router();
const { getDb } = require('../db/mongo');

// POST /new-pokemon
// Crée un nouveau Pokémon dans la collection pokedex
router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection('pokedex');

    const nouveauPokemon = req.body;

    // validation basique
    if (!nouveauPokemon.name || !nouveauPokemon.name.french || !nouveauPokemon.type) {
      return res.status(400).json({ message: 'Données incomplètes pour créer le Pokémon' });
    }

    const result = await collection.insertOne(nouveauPokemon);
    res.status(201).json({ message: 'Pokémon ajouté avec succès', id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la création du Pokémon' });
  }
});

module.exports = router;
