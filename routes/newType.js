const express = require('express');
const router = express.Router();
const { getDb } = require('../db/mongo');

// POST /types/new
// Crée un nouveau type dans la collection 'types'
router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection('types');

    const nouveauType = req.body;

    // Validation basique
    if (!nouveauType.english || !nouveauType.effective || !nouveauType.ineffective || !nouveauType.no_effect) {
      return res.status(400).json({ message: 'Données incomplètes pour créer le type' });
    }

    const result = await collection.insertOne(nouveauType);
    res.status(201).json({ message: 'Type ajouté avec succès', id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la création du type' });
  }
});

module.exports = router;
