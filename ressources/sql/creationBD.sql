DROP TABLE IF EXISTS utilisateur CASCADE;
DROP TABLE IF EXISTS tache CASCADE;
DROP TABLE IF EXISTS sous_tache CASCADE;

-- Création table utilisateur
CREATE TABLE utilisateur (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(30),
    prenom VARCHAR(30),
    courriel VARCHAR(255),
    cle_api VARCHAR(30),
    password VARCHAR(100)
);

-- Création table tache
CREATE TABLE tache (
    id SERIAL PRIMARY KEY,
    utilisateur_id INTEGER,
    titre VARCHAR(100),
    description VARCHAR(500),
    date_debut DATE,
    date_echeance DATE,
    complete BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id) ON DELETE CASCADE
);

-- Création table sous_tache
CREATE TABLE sous_tache (
    id SERIAL PRIMARY KEY,
    tache_id INTEGER,
    titre VARCHAR(100),
    complete BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (tache_id) REFERENCES tache(id) ON DELETE CASCADE
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
INSERT INTO tache (utilisateur_id, titre, description, date_debut, date_echeance) VALUES (
    currval('utilisateur_id_seq'),
    'Meeting cool',
    'Il faut démontrer X pour faire Y, sinon Z sera pas content!',
    CURRENT_DATE,
    CURRENT_DATE + 2
);

-- Ajout de sous-taches par défaut
INSERT INTO sous_tache (tache_id, titre) VALUES 
    (currval('tache_id_seq'), 'Première tâche à faire'),
    (currval('tache_id_seq'), 'Deuxième tâche à faire'),
    (currval('tache_id_seq'), 'Troisième tâche à faire');