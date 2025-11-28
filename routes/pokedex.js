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
// Recherche par nom + prise en compte tri & filtres
router.get("/search", async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection("pokedex");
    const name = (req.query.name || "").toLowerCase();

    if (name.trim() === "") {
      return res.json([]);
    }

    // récupération brute
    let pokemons = await collection.find({}).toArray();

    // filtre nom sur FR + EN
    pokemons = pokemons.filter(
      (p) =>
        p.name.french.toLowerCase().includes(name) ||
        p.name.english.toLowerCase().includes(name)
    );

    // reprise filtres existants (...)
    if (req.query.types) {
      const typesArr = req.query.types.split(",");
      pokemons = pokemons.filter((p) =>
        typesArr.every((t) => p.type.includes(t))
      );
    }

    if (req.query.sortBy) {
      const key = req.query.sortBy;
      const order = req.query.sortOrder === "asc" ? 1 : -1;

      pokemons.sort((a, b) => {
        let valA = 0,
          valB = 0;
        if (a.base && a.base[key] !== undefined) {
          valA = a.base[key];
          valB = b.base[key];
        }
        return (valA - valB) * order;
      });
    }

    res.json(pokemons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur (search + filtres)" });
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
      pokemons = pokemons.filter((p) =>
        typesArr.every((t) => p.type.includes(t))
      );
    }

    // Filtre stats Attack min/max
    if (req.query.attackMin || req.query.attackMax) {
      const min = parseInt(req.query.attackMin) || 0;
      const max = parseInt(req.query.attackMax) || 9999;
      pokemons = pokemons.filter(
        (p) => p.base?.Attack >= min && p.base?.Attack <= max
      );
    }

    // Filtre HP min/max
    if (req.query.hpMin || req.query.hpMax) {
      const min = parseInt(req.query.hpMin) || 0;
      const max = parseInt(req.query.hpMax) || 9999;
      pokemons = pokemons.filter((p) => p.base?.HP >= min && p.base?.HP <= max);
    }

    // Filtre Sp. Attack min/max
    if (req.query.spAtkMin || req.query.spAtkMax) {
      const min = parseInt(req.query.spAtkMin) || 0;
      const max = parseInt(req.query.spAtkMax) || 9999;
      pokemons = pokemons.filter(
        (p) => p.base?.["Sp. Attack"] >= min && p.base?.["Sp. Attack"] <= max
      );
    }

    // Filtre Sp. Defense min/max
    if (req.query.spDefMin || req.query.spDefMax) {
      const min = parseInt(req.query.spDefMin) || 0;
      const max = parseInt(req.query.spDefMax) || 9999;
      pokemons = pokemons.filter(
        (p) => p.base?.["Sp. Defense"] >= min && p.base?.["Sp. Defense"] <= max
      );
    }

    // Filtre Speed min/max
    if (req.query.speedMin || req.query.speedMax) {
      const min = parseInt(req.query.speedMin) || 0;
      const max = parseInt(req.query.speedMax) || 9999;
      pokemons = pokemons.filter(
        (p) => p.base?.Speed >= min && p.base?.Speed <= max
      );
    }

    // Filtre Weight min/max (ex: "13 kg" → 13)
    if (req.query.weightMin || req.query.weightMax) {
      const min = parseFloat(req.query.weightMin) || 0;
      const max = parseFloat(req.query.weightMax) || 9999;
      pokemons = pokemons.filter((p) => {
        const weight = parseFloat(p.profile?.weight); // conversion string
        return weight >= min && weight <= max;
      });
    }

    // Filtre Height min/max (ex: "1 m" → 1)
    if (req.query.heightMin || req.query.heightMax) {
      const min = parseFloat(req.query.heightMin) || 0;
      const max = parseFloat(req.query.heightMax) || 9999;
      pokemons = pokemons.filter((p) => {
        const height = parseFloat(p.profile?.height);
        return height >= min && height <= max;
      });
    }

    // Filtre niveau d'évolution
    if (req.query.evoLevel) {
      pokemons = pokemons.filter((p) =>
        p.evolution?.next?.some((e) =>
          e.includes(`Level ${req.query.evoLevel}`)
        )
      );
    }

    // Filtre gender (male / female / both)
    if (req.query.gender) {
      pokemons = pokemons.filter((p) => {
        const genderStr = p.profile?.gender; // <-- Correct
        if (!genderStr) return false;

        const [male, female] = genderStr.split(":").map(Number);

        if (req.query.gender === "male") return male > female;
        if (req.query.gender === "female") return female > male;
        if (req.query.gender === "both") return male === female;

        return true;
      });
    }

    // Tri avec sort
    if (req.query.sortBy) {
      const key = req.query.sortBy; // ex: HP, Attack, Defense, Speed, weight, height
      const order = req.query.sortOrder === "asc" ? 1 : -1;

      pokemons.sort((a, b) => {
        let valA = 0,
          valB = 0;

        // Stats classiques
        if (
          a.base &&
          b.base &&
          a.base[key] !== undefined &&
          b.base[key] !== undefined
        ) {
          valA = a.base[key];
          valB = b.base[key];
        }

        // Tri Poids
        else if (key === "weight") {
          valA = parseFloat(a.profile?.weight) || 0;
          valB = parseFloat(b.profile?.weight) || 0;
        }

        // Tri Taille
        else if (key === "height") {
          valA = parseFloat(a.profile?.height) || 0;
          valB = parseFloat(b.profile?.height) || 0;
        }

        return (valA - valB) * order;
      });
    }

    res.json(pokemons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur (filtre avancé)" });
  }
});

// permet à ce router d'être utilisé dans server.js
module.exports = router;
