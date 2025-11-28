const express = require('express');
const router = express.Router();
const { getDb } = require('../db/mongo');

// POST /new-type
// Crée un nouveau item dans la collection types
router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection('types');

    const nouveauType = req.body;

    // validation basique
    if (!nouveauType.english) {
      return res.status(400).json({ message: 'Données incomplètes pour créer item' });
    }

    const result = await collection.insertOne(nouveauType);
    res.status(201).json({ message: 'type ajouté avec succès', id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la création de type' });
  }
});

module.exports = router;
