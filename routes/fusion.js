const express = require("express");
const router = express.Router();
const { getDb } = require("../db/mongo");
const { ObjectId } = require("mongodb");

// GET /fusion
// Fusionne deux Pokémon (nom, stats, types) et renvoie le résultat
router.get("/", async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection("pokedex");

    const id1 = req.query.id1;
    const id2 = req.query.id2;

    if (!id1 || !id2) {
      return res.status(400).json({ message: "Deux ID requis" });
    }

    const p1 = await collection.findOne({ _id: new ObjectId(id1) });
    const p2 = await collection.findOne({ _id: new ObjectId(id2) });

    if (!p1 || !p2) {
      return res.status(404).json({ message: "Pokemon non trouvé" });
    }

    // Fusion du nom (50/50 en français)
    const name1 = p1.name.french;
    const name2 = p2.name.french;
    const nameFusion =
      name1.slice(0, Math.ceil(name1.length / 2)) +
      name2.slice(Math.floor(name2.length / 2));

    // Moyenne des stats
    const stats = {};
    for (const key in p1.base) {
      stats[key] = Math.round((p1.base[key] + p2.base[key]) / 2);
    }

    // Fusion des types (sans doublons)
    const typesFusion = [...new Set([...p1.type, ...p2.type])];

    // On renvoie juste le résultat, sans l'enregistrer en base
    res.json({
      name: nameFusion,
      type: typesFusion,
      base: stats,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur fusion" });
  }
});

module.exports = router;
