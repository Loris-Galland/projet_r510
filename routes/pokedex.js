const express = require("express");
const router = express.Router();
const { getDb } = require("../db/mongo"); // recupérer la connexion mongoDB

// GET /pokedex
// récupérer tous les Pokémon ou seulement ceux d'un type précis
// (peut aussi filtrer par nom si ?name= est présent)
router.get("/", async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection("pokedex");
    const typeQuery = req.query.type; // lecture du "type" dans url
    const nameQuery = req.query.name; // lecture du "nom" dans url
    let query = {};

    // Si un type est demandé, on filtre dessus
    if (typeQuery) {
      query.type = {
        $elemMatch: { $regex: new RegExp(`^${typeQuery}$`, "i") },
      };
    }

    // Si un nom est demandé, on filtre aussi par nom français
    if (nameQuery) {
      query["name.french"] = { $regex: `^${nameQuery}`, $options: "i" };
    }

    const pokemons = await collection.find(query).toArray(); //exec request + conversion en tab
    res.json(pokemons);
  } catch (err) {
    console.error(err);
    res.status(500).send("erreur serveur");
  }
});

// Dictionnaire de correspondance
const LANG_MAP = {
  fr: "french",
  en: "english",
  jp: "japanese",
  cn: "chinese",
};

// GET /pokedex/search
// rechercher les Pokémon dont le nom commence par certaines lettres
// (et optionnellement filtrer par type en même temps)
router.get("/search", async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection("pokedex");
    const nameQuery = req.query.name || "";
    const typeQuery = req.query.type || ""; // on lit aussi le type s’il est présent dans l’URL
    const langQuery = req.query.lang || "fr";

    const lang = LANG_MAP[langQuery] || "french";

    if (nameQuery.trim() === "") {
      return res.json([]);
    }

    // Construction dynamique du filtre combiné
    const query = {
      [`name.${lang}`]: { $regex: `^${nameQuery}`, $options: "i" },
    };

    // Si un type est aussi présent, on le combine dans la recherche
    if (typeQuery) {
      query.type = {
        $elemMatch: { $regex: new RegExp(`^${typeQuery}$`, "i") },
      };
    }

    const pokemons = await collection.find(query).toArray();

    res.json(pokemons);
  } catch (err) {
    console.error(err);
    res.status(500).send("erreur serveur (search)");
  }
});

// GET /pokedex/filter
// Filtrage avancé multi-critères (version simple avec parsing JS)
router.get("/filter", async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection("pokedex");

    // Récupération brute
    let pokemons = await collection.find({}).toArray();

    // Multi-types (ex: Fire,Flying)
    if (req.query.types) {
      const typesArr = req.query.types.split(",");
      pokemons = pokemons.filter(p =>
        typesArr.every(t => p.type.includes(t))
      );
    }

    // Filtre stats Attack min/max
    if (req.query.attackMin || req.query.attackMax) {
      const min = parseInt(req.query.attackMin) || 0;
      const max = parseInt(req.query.attackMax) || 9999;
      pokemons = pokemons.filter(p =>
        p.base?.Attack >= min && p.base?.Attack <= max
      );
    }

    // Filtre HP min/max
    if (req.query.hpMin || req.query.hpMax) {
      const min = parseInt(req.query.hpMin) || 0;
      const max = parseInt(req.query.hpMax) || 9999;
      pokemons = pokemons.filter(p =>
        p.base?.HP >= min && p.base?.HP <= max
      );
    }

    // Filtre Weight min/max (ex: "13 kg" → 13)
    if (req.query.weightMin || req.query.weightMax) {
      const min = parseFloat(req.query.weightMin) || 0;
      const max = parseFloat(req.query.weightMax) || 9999;
      pokemons = pokemons.filter(p => {
        const weight = parseFloat(p.profile?.weight); // conversion string
        return weight >= min && weight <= max;
      });
    }

    // Filtre Height min/max (ex: "1 m" → 1)
    if (req.query.heightMin || req.query.heightMax) {
      const min = parseFloat(req.query.heightMin) || 0;
      const max = parseFloat(req.query.heightMax) || 9999;
      pokemons = pokemons.filter(p => {
        const height = parseFloat(p.profile?.height);
        return height >= min && height <= max;
      });
    }

    // Filtre niveau d'évolution
    if (req.query.evoLevel) {
      pokemons = pokemons.filter(p =>
        p.evolution?.next?.some(e => e.includes(`Level ${req.query.evoLevel}`))
      );
    }

    res.json(pokemons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur (filtre avancé)" });
  }
});


// permet à ce router d'être utilisé dans server.js
module.exports = router;
