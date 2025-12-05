const express = require('express');
const router = express.Router();
const { getDb } = require('../db/mongo');

// POST /new-item
// Crée un nouveau item dans la collection items
router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection('items');

    const nouveauItem = req.body;

    // validation basique
    if (!nouveauItem.name || !nouveauItem.name.english || !nouveauItem.type) {
      return res.status(400).json({ message: 'Données incomplètes pour créer item' });
    }

    const result = await collection.insertOne(nouveauItem);
    res.status(201).json({ message: 'item ajouté avec succès', id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la création de l item' });
  }
});

module.exports = router;
