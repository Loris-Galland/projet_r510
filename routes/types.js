const express = require('express');
const router = express.Router();
const { getDb } = require('../db/mongo');

router.get('/',async (req, res) => {
  try {
    const db = getDb();
    const types = await db.collection('types').find({}).toArray();
    res.json(types);
  } catch (err) {
    console.error(err);
    res.status(500).send('erreur serveur');
  }
});

module.exports = router;
