// Importation des modules nécessaires
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
app.use(cors()); // Autorise les requêtes entre origines différentes (ex : front et backend)
app.use(express.json()); // Permet de lire le corps des requêtes JSON

// Configuration de la connexion MongoDB
const url='mongodb://localhost:27017';
const client=new MongoClient(url);
const dbName='projet_r510'; 
let db;

// Connexion unique à MongoDB
async function initMongo() {
  try {
    await client.connect();
    db= client.db(dbName);
    console.log('Connecté à MongoDB');
  } catch (err) {
    console.error('Erreur de connexion MongoDB :', err);
  }
}

// --- GET /pokedex ---
// Récupère les Pokémon, avec ou sans filtrage par type
app.get('/pokedex', async (req, res)=>{
    try {
        const collection = db.collection('pokedex');
        const typeQuery = req.query.type; // Récupère le paramètre ?type= dans l’URL
        let query = {};
        if (typeQuery) {
            // Si un type est précisé, on filtre les Pokémon dont le tableau "type" contient ce type
            // $elemMatch permet de matcher un élément du tableau
            query = { type: { $elemMatch: { $regex: new RegExp(`^${typeQuery}$`, 'i') } } };
        }
        
        const pokemons=await collection.find(query).toArray(); // Executer la requête
        res.json(pokemons); // Renvoie le résultat au client
    }catch (err){
        console.error(err);
        res.status(500).send('erreur serveur');
    }
});

// --- GET /items ---
// Récupère les objets (items), filtrés par type si précisé

app.get('/items',async (req,res)=>{
    try {
        const collection = db.collection('items');
        const typeQuery=req.query.type;
        let query={};
        if (typeQuery) {
            // On enlève le $elemMatch car c'est un String
            query = { type: { $regex: new RegExp(`^${typeQuery}$`, 'i')}};
        }
        const items=await collection.find(query).toArray();
        res.json(items);
    } catch (err){
        console.error(err);
        res.status(500).send('erreur serveur');
    }
});

// --- GET /moves ---
// Récupère les moves

app.get('/moves',async (req,res)=>{
    try {
        const collection = db.collection('moves');
        const typeQuery=req.query.type;
        let query={};
        if (typeQuery) {
            // On enlève le $elemMatch car c'est un String
            query = { type: { $regex: new RegExp(`^${typeQuery}$`, 'i')}};
        }
        const moves=await collection.find(query).toArray();
        res.json(moves);
    } catch (err){
        console.error(err);
        res.status(500).send('erreur serveur');
    }
});


// Sert les fichiers statiques (HTML, CSS, JS) du dossier /public
app.use(express.static(path.join(__dirname, 'public')));

// Démarre le serveur sur le port 3000
const PORT=3000;
app.listen(PORT, () => {
    initMongo();
    console.log(`Server run sur http://localhost:${PORT}`);
});
