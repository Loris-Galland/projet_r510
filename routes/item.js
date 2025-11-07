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
    const item = await collection.findOne({ _id: new ObjectId(id)});

    if (!item) {
      return res.status(404).json({ message: 'Item introuvable' });
    }

    res.json(item);
  } catch (err) {
    console.error('erreur route /item/:id →', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /item/:id 

router.put('/:id', async (req, res) => { 
  try {
    const db = getDb(); 
    const collection = db.collection('items');
    const id = new ObjectId(req.params.id); // id de l'item à mettre à jour
    const updateData = req.body;  // données à mettre à jour
    const result = await collection.updateOne({ _id: id }, { $set: updateData }); // met à jour les champs spécifiés dans updateData

    if (result.modifiedCount===0) {
      return res.status(404).json({ message: 'aucun item mis à jour' });
    }
    res.json({ message:'Item bien mit à jour' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// DELETE /item/:id

router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection('items');
    const id = new ObjectId(req.params.id);
    const result = await collection.deleteOne({ _id: id }); // supprime l'item avec l'id spécifié

    if (result.deletedCount===0) {
      return res.status(404).json({ message:'item introuvable' });
    }
      res.json({ message: 'item bien supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'erreur serveur' });
  }
});

module.exports = router;
