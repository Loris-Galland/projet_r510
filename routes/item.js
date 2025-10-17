const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/mongo');

// Querry pour récupérer un item par son ID
// Avec le : dans /:id on indique à express qu'il s'agit d'un paramètre dynamique
// Ex: /item/643a1f2e5f3c2a6b8c9d4e5f
router.get('/:id',async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection('items');
    const id = req.params.id;
    const item = await collection.findOne({ _id: new ObjectId(req.params.id) });

    if (!item) {
      return res.status(404).json({ message: 'Item introuvable' });
    }

    res.json(item);
  } catch (err) {
    console.error('erreur route /item/:id →', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
