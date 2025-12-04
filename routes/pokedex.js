const express = require("express");
const router = express.Router();
const { getDb } = require("../db/mongo");

// GET /pokedex
// Route unique : Gère l'affichage, la recherche, les filtres et le tri
router.get("/", async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection("pokedex");

    // On récupère tout 
    let pokemons = await collection.find({}).toArray();

    // Application des filtres dynamiques
    //  Filtre Recherche (Nom) 
    if (req.query.name) {
      const search = req.query.name.toLowerCase();
      pokemons = pokemons.filter(
        (p) =>
          p.name.french.toLowerCase().includes(search) ||
          p.name.english.toLowerCase().includes(search)
      );
    }

    //  Filtre Types (ex: ?types=Fire,Flying) 
    if (req.query.types) {
      const typesArr = req.query.types.split(",");
      pokemons = pokemons.filter((p) =>
        typesArr.every((t) => p.type.includes(t))
      );
    }

    // Filtres Statistiques (Min/Max) 
    // Fonction helper pour éviter de répéter le code
    const filterRange = (minQuery, maxQuery, getValueFn) => {
      if (minQuery || maxQuery) {
        const min = parseFloat(minQuery) || 0;
        const max = parseFloat(maxQuery) || 99999;
        pokemons = pokemons.filter((p) => {
          const val = getValueFn(p);
          return val >= min && val <= max;
        });
      }
    };

    filterRange(req.query.attackMin, req.query.attackMax, p => p.base?.Attack);
    filterRange(req.query.hpMin, req.query.hpMax, p => p.base?.HP);
    filterRange(req.query.spAtkMin, req.query.spAtkMax, p => p.base?.["Sp. Attack"]);
    filterRange(req.query.spDefMin, req.query.spDefMax, p => p.base?.["Sp. Defense"]);
    filterRange(req.query.speedMin, req.query.speedMax, p => p.base?.Speed);
    
    // Filtres Poids/Taille (Parsing des strings "6.9 kg")
    filterRange(req.query.weightMin, req.query.weightMax, p => parseFloat(p.profile?.weight));
    filterRange(req.query.heightMin, req.query.heightMax, p => parseFloat(p.profile?.height));

    // --- Filtres Spéciaux ---
    
    // Niveau d'évolution
    if (req.query.evo) {
      const evoCount = parseInt(req.query.evo);
      pokemons = pokemons.filter((p) => (p.evolution?.next?.length || 0) === evoCount);
    }

    // Genre (Parsing "87.5:12.5")
    if (req.query.gender) {
      pokemons = pokemons.filter((p) => {
        const genderStr = p.profile?.gender;
        if (!genderStr) return false;
        const [male, female] = genderStr.split(":").map(Number);

        if (req.query.gender === "male") return male > female;
        if (req.query.gender === "female") return female > male;
        if (req.query.gender === "both") return male === female;
        return true;
      });
    }

    // Tri (Sort)
    if (req.query.sortBy) {
      const key = req.query.sortBy;
      const order = req.query.sortOrder === "asc" ? 1 : -1;

      pokemons.sort((a, b) => {
        // Fonction helper pour récupérer la valeur proprement
        // Retourne 'null' si la stat n'existe pas ou est invalide
        const getValue = (p) => {
          let val;
          if (key === "weight") {
            val = parseFloat(p.profile?.weight);
          } else if (key === "height") {
            val = parseFloat(p.profile?.height);
          } else if (p.base) {
            val = p.base[key];
          }
          
          // Si val n'est pas un nombre (NaN, undefined, null), on renvoie null
          if (val === undefined || val === null || isNaN(val)) return null;
          return val;
        };

        const valA = getValue(a);
        const valB = getValue(b);
        
        // Si les deux sont manquants -> égalité
        if (valA === null && valB === null) return 0;
        
        // Si A est manquant -> il part à la fin (return 1)
        if (valA === null) return 1;
        
        // Si B est manquant -> A passe devant (return -1)
        if (valB === null) return -1;

        // Comparaison normale si les deux existent 
        return (valA - valB) * order;
      });
    }

    res.json(pokemons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;