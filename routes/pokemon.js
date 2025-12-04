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

// DELETE /pokemon/:id
// Supprime un Pokémon par son _id
router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection('pokedex');
    const { id } = req.params;

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Pokémon non trouvé" });
    }

    res.json({ message: "Pokémon supprimé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de la suppression" });
  }
});

// PUT /pokemon/:id
// Met à jour les informations d'un Pokémon
router.put('/:id', async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection('pokedex');
    const { id } = req.params;
    const updates = req.body;
    
    // (MongoDB interdit de modifier le champ _id)
    delete updates._id;

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Pokémon introuvable pour mise à jour" });
    }

    res.json({ message: "Pokémon mis à jour avec succès !" });
  } catch (err) {
    console.error("Erreur update :", err);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour" });
  }
});

module.exports = router;
