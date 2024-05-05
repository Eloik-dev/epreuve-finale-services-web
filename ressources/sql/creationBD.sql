DROP DATABASE IF EXISTS epreuve_finale;
DROP TABLE IF EXISTS utilisateur CASCADE;
DROP TABLE IF EXISTS taches CASCADE;
DROP TABLE IF EXISTS sous_taches CASCADE;
CREATE DATABASE epreuve_finale;

-- Création table utilisateur
CREATE TABLE utilisateur (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(30),
    prenom VARCHAR(30),
    courriel VARCHAR(255),
    cle_api VARCHAR(30),
    password VARCHAR(100)
);

-- Création table taches
CREATE TABLE taches (
    id SERIAL PRIMARY KEY,
    utilisateur_id INTEGER,
    titre VARCHAR(100),
    description VARCHAR(500),
    date_debut DATE,
    date_echeance DATE,
    complete BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id)
);

-- Création table sous_taches
CREATE TABLE sous_taches (
    id SERIAL PRIMARY KEY,
    tache_id INTEGER
    titre VARCHAR(100),
    complete BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (tache_id) REFERENCES taches(id) ON DELETE CASCADE
);

-- Ajout de valeurs par défaut
INSERT INTO utilisateur (nom, prenom, courriel, cle_api, password) VALUES (
    'admin',
    'api',
    'admin@api.com',
    '1234',
    'admin_api'
);

-- Ajout de taches par défaut
INSERT INTO taches (utilisateur_id, titre, description, date_debut, date_echeance) VALUES (
    currval('utilisateur_id_seq'),
    'Meeting cool',
    'Il faut démontrer X pour faire Y, sinon Z sera pas content!',
    CURRENT_DATE,
    CURRENT_DATE + 2
);

-- Ajout de sous-taches par défaut
INSERT INTO sous_taches (tache_id, titre) VALUES 
    (currval('taches_id_seq'), 'Première tâche à faire'),
    (currval('taches_id_seq'), 'Deuxième tâche à faire'),
    (currval('taches_id_seq'), 'Troisième tâche à faire');