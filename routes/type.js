const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/mongo');

// Querry pour récupérer un type par son ID
// Avec le : dans /:id on indique à express qu'il s'agit d'un paramètre dynamique
// Ex: /type/643a1f2e5f3c2a6b8c9d4e5f
router.get('/:id',async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection('types');
    const id = req.params.id;
    const type = await collection.findOne({ _id: new ObjectId(id)});

    if (!type) {
      return res.status(404).json({ message: 'type introuvable' });
    }

    res.json(type);
  } catch (err) {
    console.error('erreur route /type/:id →', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /type/:id 

router.put('/:id', async (req, res) => { 
  try {
    const db = getDb(); 
    const collection = db.collection('types');
    const id = new ObjectId(req.params.id); // id de type à mettre à jour
    const updateData = req.body;  // données à mettre à jour
    const result = await collection.updateOne({ _id: id }, { $set: updateData }); // met à jour les champs spécifiés dans updateData set

    if (result.modifiedCount===0) {
      return res.status(404).json({ message: 'aucun type mis à jour' });
    }
    res.json({ message:'type bien mit à jour' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// DELETE /type/:id

router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection('type');
    const id = new ObjectId(req.params.id);
    const result = await collection.deleteOne({ _id: id }); // supprime ltype avec l'id spécifié

    if (result.deletedCount===0) {
      return res.status(404).json({ message:'type introuvable' });
    }
      res.json({ message: 'type bien supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'erreur serveur' });
  }
});

module.exports = router;
