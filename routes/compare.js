const express = require("express");
const router = express.Router();
const { getDb } = require("../db/mongo");
const { ObjectId } = require("mongodb");

// GET /compare
// Compare deux Pokémon et retourne toutes leurs infos + analyse stats
router.get("/", async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection("pokedex");

    const id1 = req.query.id1;
    const id2 = req.query.id2;

    // Vérification IDs
    if (!id1 || !id2) {
      return res.status(400).json({ message: "Deux ID requis pour comparer" });
    }

    // Récupération via ObjectId
    const p1 = await collection.findOne({ _id: new ObjectId(id1) });
    const p2 = await collection.findOne({ _id: new ObjectId(id2) });

    if (!p1 || !p2) {
      return res.status(404).json({ message: "Pokemon non trouvé" });
    }

    // Comparaison stat par stat
    const comparison = {};
    for (const key in p1.base) {
      if (typeof p1.base[key] === "number" && typeof p2.base[key] === "number") {
        comparison[key] = {
          p1: p1.base[key],
          p2: p2.base[key],
          winner: p1.base[key] > p2.base[key] ? p1.name.french :
                   p2.base[key] > p1.base[key] ? p2.name.french :
                   "Égalité"
        };
      }
    }

    res.json({
      pokemon1: p1,
      pokemon2: p2,
      comparison
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur comparaison" });
  }
});

module.exports = router;
