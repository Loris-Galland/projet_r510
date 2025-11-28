const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/mongo');

// Querry pour récupérer une attaque par son ID
// Avec le : dans /:id on indique à express qu'il s'agit d'un paramètre dynamique
// Ex: /move/643a1f2e5f3c2a6b8c9d4e5f
router.get('/:id',async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection('moves');
    const id = req.params.id;
    const move = await collection.findOne({ _id: new ObjectId(id)});

    if (!move) {
      return res.status(404).json({ message: 'attaque introuvable' });
    }

    res.json(move);
  } catch (err) {
    console.error('erreur route /move/:id →', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /move/:id 

router.put('/:id', async (req, res) => { 
  try {
    const db = getDb(); 
    const collection = db.collection('moves');
    const id = new ObjectId(req.params.id); // id de l'move à mettre à jour
    const updateData = req.body;  // données à mettre à jour
    const result = await collection.updateOne({ _id: id }, { $set: updateData }); // met à jour les champs spécifiés dans updateData set

    if (result.modifiedCount===0) {
      return res.status(404).json({ message: 'aucun move mis à jour' });
    }
    res.json({ message:'move bien mit à jour' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// DELETE /item/:id

router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection('moves');
    const id = new ObjectId(req.params.id);
    const result = await collection.deleteOne({ _id: id }); // supprime l'item avec l'id spécifié

    if (result.deletedCount===0) {
      return res.status(404).json({ message:'attaque introuvable' });
    }
      res.json({ message: 'attaque bien supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'erreur serveur' });
  }
});

module.exports = router;
