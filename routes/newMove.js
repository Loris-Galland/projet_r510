const express = require('express');
const router = express.Router();
const { getDb } = require('../db/mongo');

// POST /new-move
// Crée un nouveau move dans la collection moves
router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection('moves');

    const nouveauMove = req.body;

    // validation basique
    if (!nouveauMove.ename || !nouveauMove.accuracy || !nouveauMove.power) {
      return res.status(400).json({ message: 'Données incomplètes pour créer une attaque' });
    }

    const result = await collection.insertOne(nouveauMove);
    res.status(201).json({ message: 'attaque ajoutée avec succès', id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la création de attaque' });
  }
});

module.exports = router;
