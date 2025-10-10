const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'projet_r510';
const client = new MongoClient(url);

let db;

async function initMongo() {
  await client.connect();
  db=client.db(dbName);
  console.log('connecté à MongoDB');
}

// fonction qui renvoie la référence à la base de données...
// si connexion pas encore initialisée elle lance une erreur
function getDb() {
  if (!db) throw new Error('base non initialisée'); // verif si db existe
  return db;
}
// permet d'importer initMongo et getDb depuis d'autres fichiers
module.exports={initMongo,getDb};
