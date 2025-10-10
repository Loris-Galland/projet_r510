Projet R510 - Node.js & MongoDB

Description du projet
---------------------
Ce projet contient une application qui intéragit avec une base MongoDB pour faire toutes sortes d'opération sur des pokémons, des moves, des types et items. Le backend est développé avec Node.js + Express. Le frontend utilise du JavaScript simple et interagit
avec l’API via fetch().

📁 Structure du projet
----------------------
C:.
├── db
│   └── mongo.js               -> Connexion DB
│
├── node_modules
│   └── ...
│
├── public
│   ├── assets
│   │   └── (images, icônes, ressources diverses)
│   ├── css
│   │   └── style.css          → Feuille CSS de l'appli
│   ├── js
│   │   ├── index.js           → Script JS pour la page d’accueil
│   │   ├── pokedex.js         → Gère l’affichage,filtrage... des Pokémons
│   │   ├── items.js           → Gère l’affichage,filtrage... des objets
│   │   ├── moves.js           → Gère l’affichage,filtrage... des attaques
│   │   └── types.js           → Gère l’affichage,filtrage... disponibles
│   ├── index.html             → Page d’accueil avec les liens vers les sections
│   ├── pokedex.html           → Page du Pokédex
│   ├── items.html             → Page des objets
│   ├── moves.html             → Page des attaques
│   └── types.html             → Page des types
│
├── routes
│   ├── pokedex.js             → Route Express pour récupérer les Pokémons et filtres...
│   ├── items.js               → Route Express pour récupérer les objets et filtres...
│   ├── moves.js               → Route Express pour récupérer les attaques et filtres...
│   ├── types.js               → Route Express pour récupérer les types et filtres...
│   └── pokemon.js             → Route dédiée à un Pokémon précis 
│
├── .gitignore             
├── package.json               → Configuration Node.js et dépendances
├── package-lock.json
└── server.js                  → Point d’entrée principal du serveur Express

--------------------------------------------------
Fonctionnement du backend (Node.js + Express)
--------------------------------------------------

- `server.js` : fichier principal qui :
  - initialise Express et CORS 
  - établit la connexion à MongoDB (via `initMongo()` depuis `db/mongo.js`) 
  - importe et monte les routes définies dans le dossier `/routes` 
  - sert les fichiers statiques du dossier `/public`

- `db/mongo.js` :
  - gère la connexion MongoDB avec `MongoClient` 
  - fournit la fonction `getDb()` pour accéder à la base de données depuis les routes

- Chaque fichier dans `/routes` (ex: `pokedex.js`, `items.js`, etc.) :
  - définit des routes (et d’autres plus tard) ;
  - interroge MongoDB via `getDb()` ;
  - renvoie les résultats au frontend en JSON.

--------------------------------------------------

🎨 Fonctionnement du frontend (HTML / CSS / JS)
--------------------------------------------------

- Les fichiers HTML dans `/public` représentent les différentes pages du site
- Chaque page HTML charge son propre script JavaScript correspondant (dans `/public/js`)
- Ces scripts JS utilisent `fetch()` pour interroger le serveur (par exemple `/pokedex?type=Fire`)
- Le résultat est affiché dynamiquement dans le DOM (cartes Pokémons,liste d’objets,etc...)

--------------------------------------------------
🚀 Lancement du projet
----------------------

1.Installer les dépendances :
   ```bash
   npm install
   ```

2.Démarrer MongoDB (par exemple via Compass, le serveur doit être actif sur `mongodb://localhost:27017`)

3.Lancer le serveur node :
   ```bash
   node server.js
   ```

4️.Ouvrir le navigateur à l’adresse :
   [http://localhost:3000](http://localhost:3000)

--------------------------------------------------
🧱 Base de données MongoDB (projet_r510)
----------------------------------------
Collections attendues :
- `pokedex` : contient les Pokémons avec leurs types et images
- `items`   : objets utilisables
- `moves`   : attaques ou capacités
- `types`   : liste des types de Pokémons

--------------------------------------------------

✏️ Auteur / Notes
Ce projet a été réalisé à deux dans le cadre d'un projet scolaire.
------------------
README provisoire créé pour documenter l’organisation du projet et son utilisation.
Ce fichier sera complété avec les détails des routes, des schémas de données et des exemples d’utilisation.


