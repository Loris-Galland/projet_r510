Projet R510 - Node.js & MongoDB

Description du projet
---------------------
Ce projet contient une application web complète permettant d'interagir avec une base **MongoDB** pour gérer les données de l'univers Pokémon : **Pokédex**, **attaques (Moves)**, **objets (Items)** et **Types**. Le backend est développé avec **Node.js** et **Express**, fournissant une API REST complète (**CRUD**). L'API inclut des fonctionnalités avancées de filtrage, de tri, ainsi que des fonctions uniques comme la **Fusion** et la **Comparaison** de Pokémon.

Le frontend utilise du JavaScript simple pour consommer cette API via `fetch()` et affiche les données de manière dynamique.

***

## 📁 Structure du projet

```bash
C:.
├── db
│   └── mongo.js              → Connexion et gestion de la base MongoDB
│
├── node_modules              → Modules Node.js installés automatiquement
│
├── public                    → Contient tout le code front-end (HTML, CSS, JS)
│   ├── assets                → Images, icônes, ressources diverses
│   ├── css
│   │   ├── style.css         → Style principal (cartes liste)
│   │   ├── new-pokemon.css   → Style des formulaires de création
│   │   ├── pokemon-details.css → Style des pages de détails de Pokémon/Type
│   │   ├── item-detail.css   → Style des pages de détails d'Item
│   │   ├── move-detail.css   → Style des pages de détails d'Attaque
│   │   └── fusion.css        → Style de la page de Fusion
│   │
│   ├── js
│   │   ├── i18n.js           → Gestion de la langue d'affichage des noms
│   │   ├── pokedex.js        → Affichage, filtrage et tri des Pokémons
│   │   ├── pokemon.js        → Détails, modification (PUT) et suppression (DELETE) d'un Pokémon
│   │   ├── new-pokemon.js    → Logique de création (POST) d'un Pokémon
│   │   ├── items.js          → Affichage et filtrage des objets (Items)
│   │   ├── item.js           → Détails, modification (PUT) et suppression (DELETE) d'un Item
│   │   ├── new-item.js       → Logique de création (POST) d'un Item
│   │   ├── moves.js          → Affichage et recherche des attaques (Moves)
│   │   ├── move.js           → Détails, modification (PUT) et suppression (DELETE) d'une Attaque
│   │   ├── new-move.js       → Logique de création (POST) d'une Attaque
│   │   ├── types.js          → Affichage des types disponibles
│   │   ├── type.js           → Détails, modification (PUT) et suppression (DELETE) d'un Type
│   │   ├── new-type.js       → Logique de création (POST) d'un Type
│   │   ├── fusion.js         → Logique de la fonctionnalité de fusion
│   │   └── compare.js        → Logique du comparateur de stats
│   │
│   ├── index.html            → Page d’accueil avec navigation
│   ├── pokedex.html          → Page du Pokédex (Liste et Filtres Avancés)
│   ├── pokemon.html          → Page Détail/Édition d'un Pokémon
│   ├── new-pokemon.html      → Page de création d'un Pokémon
│   ├── items.html            → Page des objets (Liste)
│   ├── item.html             → Page Détail/Édition d'un Item
│   ├── new-item.html         → Page de création d'un Item
│   ├── moves.html            → Page des attaques (Liste)
│   ├── move.html             → Page Détail/Édition d'une Attaque
│   ├── new-move.html         → Page de création d'une Attaque
│   ├── types.html            → Page des types (Liste)
│   ├── type.html             → Page Détail/Édition d'un Type
│   ├── new-type.html         → Page de création d'un Type
│   ├── fusion.html           → Page de la fonctionnalité de fusion
│   └── compare.html          → Page du comparateur de Pokémon
│
├── routes                    → Routes Express (API backend)
│   ├── pokedex.js            → Route principale pour les Pokémons (+ filtres/tri)
│   ├── pokemon.js            → Route CRUD pour un seul Pokémon (GET, PUT, DELETE)
│   ├── newPokemon.js         → Route pour la création d'un Pokémon (POST)
│   ├── items.js              → Route principale pour les objets (+ filtres/recherche)
│   ├── item.js               → Route CRUD pour un seul Item (GET, PUT, DELETE)
│   ├── newItem.js            → Route pour la création d'un Item (POST)
│   ├── moves.js              → Route principale pour les attaques (+ filtres/recherche)
│   ├── move.js               → Route CRUD pour une seule Attaque (GET, PUT, DELETE)
│   ├── newMove.js            → Route pour la création d'une Attaque (POST)
│   ├── types.js              → Route principale pour les types (Liste)
│   ├── type.js               → Route CRUD pour un seul Type (GET, PUT, DELETE)
│   ├── newType.js            → Route pour la création d'un Type (POST)
│   ├── fusion.js             → Route pour la fusion de Pokémon (GET)
│   └── compare.js            → Route pour la comparaison de Pokémon (GET)
│
├── .gitignore                → Fichiers à exclure du dépôt Git
├── package.json              → Configuration du projet Node.js
├── package-lock.json         → Détails des dépendances installées
└── server.js                 → Point d’entrée principal du serveur Express
```

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

Fonctionnement du frontend (HTML / CSS / JS)
--------------------------------------------------

- Les fichiers HTML dans `/public` représentent les différentes pages du site
- Chaque page HTML charge son propre script JavaScript correspondant (dans `/public/js`)
- Ces scripts JS utilisent `fetch()` pour interroger le serveur (par exemple `/pokedex?type=Fire`)
- Le résultat est affiché dynamiquement dans le DOM (cartes Pokémons,liste d’objets,etc...)

--------------------------------------------------
Lancement du projet
----------------------

1. Installer les dépendances :
   ```bash
   npm install
   ```

2. Démarrer MongoDB (par exemple via Compass, le serveur doit être actif sur `mongodb://localhost:27017`)

3. Lancer le serveur node :
   ```bash
   node server.js
   ```

4️. Ouvrir le navigateur à l’adresse :
   [http://localhost:3000](http://localhost:3000)

--------------------------------------------------
Base de données MongoDB (projet_r510)
----------------------------------------
Collections attendues :
- `pokedex` : contient les Pokémons avec leurs types et images
- `items`   : objets utilisables
- `moves`   : attaques ou capacités
- `types`   : liste des types de Pokémons

--------------------------------------------------

Auteur / Notes
------------------
Ce projet a été réalisé à deux dans le cadre d'un projet scolaire.
README provisoire créé pour documenter l’organisation du projet et son utilisation