const express = require('express');
const router = express.Router();
const { getDb } = require('../db/mongo');

router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection('moves');
    const typeQuery = req.query.type;
    let query = {};

    if (typeQuery) {
      query = { type: { $regex: new RegExp(`^${typeQuery}$`,'i')}};
    }

    const moves = await collection.find(query).toArray();
    res.json(moves);
  } catch (err) {
    console.error(err);
    res.status(500).send('erreur serveur');
  }
});

module.exports = router;
