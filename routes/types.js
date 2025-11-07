const express = require('express');
const router = express.Router();
const { getDb } = require('../db/mongo');
const { ObjectId } = require('mongodb');

// GET /types 
// récupère tous les types
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const types = await db.collection('types').find({}).toArray();
    res.json(types);
  } catch (err) {
    console.error(err);
    res.status(500).send('erreur serveur');
  }
});

// GET /types/:id 
// récupérer un type par ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const type = await db.collection('types').findOne({ _id: new ObjectId(id) });
    if (!type) return res.status(404).send('Type introuvable');
    res.json(type);
  } catch (err) {
    console.error(err);
    res.status(500).send('erreur serveur');
  }
});

// POST /types 
// créer un type
router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const nouveauType = req.body;

    if (!nouveauType.english) {
      return res.status(400).json({ message: 'Nom anglais requis' });
    }

    const result = await db.collection('types').insertOne(nouveauType);
    res.status(201).json({ message: 'Type ajouté', id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la création' });
  }
});

// DELETE /types/:id 
// supprimer un type
router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const result = await db.collection('types').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Type non trouvé' });
    }

    res.json({ message: 'Type supprimé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression' });
  }
});

module.exports = router;
