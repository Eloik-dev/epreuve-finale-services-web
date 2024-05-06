const sql = require("../config/db_pg.js");
const Utilisateur = require("../models/utilisateur.model.js");
const HttpError = require("../utils/HttpError.js");

class Tache {
    static nom_table = "tache";

    constructor(tache) {
        this.id = tache.id;
        this.utilisateur_id = tache.utilisateur_id;
        this.titre = tache.titre;
        this.description = tache.description;
        this.date_debut = tache.date_debut;
        this.date_echeance = tache.date_echeance;
        this.complete = tache.complete;
    };

    // Trouve une tâche avec un ID et une clé API
    static trouverParID(cleApi = "", tache_id = -1) {
        return new Promise((resolve, reject) => {
            const requete = `SELECT t.* FROM ${this.nom_table} t INNER JOIN ${Utilisateur.nom_table} u ON u.id = t.utilisateur_id WHERE u.cle_api = $1::text AND t.id = $2::int;`;
            const parametres = [cleApi, tache_id];

            sql.query(requete, parametres, (erreur, resultat) => {
                if (erreur) {
                    return reject(new Error(`Erreur sqlState ${erreur.code} : ${erreur.message}`));
                }

                resolve(resultat.rows);
            });
        });
    }

    // Ajoute une tâche pour un utilisateur
    static ajouter(cleApi = "", titre, description, date_debut, date_echeance) {
        return new Promise((resolve, reject) => {
            const requeteUtilisateur = `SELECT id FROM ${Utilisateur.nom_table} WHERE cle_api = $1::text`;
            sql.query(requeteUtilisateur, [cleApi], (erreur, resultat) => {
                if (erreur) {
                    return reject(new Error(`Erreur sqlState ${erreur.code} : ${erreur.message}`));
                } else if (resultat.rowCount === 0) {
                    return reject(new Error(`Aucun utilisateur trouvé avec la clé API ${cleApi}`));
                } else {
                    const utilisateur_id = resultat.rows[0].id;

                    const requeteTache = `
                    INSERT INTO ${this.nom_table} (utilisateur_id, titre, description, date_debut, date_echeance) VALUES (
                        $1::int,
                        $2::text,
                        $3::text,
                        $4::date,
                        $5::date
                    ) RETURNING *;`;
                    const parametres = [utilisateur_id, titre, description, date_debut, date_echeance];

                    sql.query(requeteTache, parametres, (erreur, resultat) => {
                        if (erreur) {
                            reject(new Error(`Erreur sqlState ${erreur.code} : ${erreur.message}`));
                        } else {
                            resolve(resultat.rows);
                        }
                    });
                }
            });
        });
    }

    // Modifie une tâche grâce à son ID et clé d'API
    static modifier(cleApi = "", tache_id = -1, changements = {}) {
        return new Promise((resolve, reject) => {
            let setQuery = Object.keys(changements).map((key, index) => `${key} = $${index + 1}`).join(", ");
            const count_changements = Object.keys(changements).length;

            const requete = `
            UPDATE ${this.nom_table} t
                SET ${setQuery}
                WHERE t.utilisateur_id = (
                    SELECT u.id
                    FROM ${Utilisateur.nom_table} u 
                    WHERE u.cle_api = $${count_changements + 1}::text
                ) AND id = $${count_changements + 2}::int
                RETURNING *;`;
            const parametres = [...Object.values(changements), cleApi, tache_id];

            sql.query(requete, parametres, (erreur, resultat) => {
                if (erreur) {
                    return reject(new Error(`Erreur sqlState ${erreur.code} : ${erreur.message}`));
                }

                if (resultat.rowCount === 0) {
                    return reject(new HttpError("La tâche n'a pas été trouvée.", 404));
                }

                resolve(resultat.rows);
            });
        });
    }

    // Modifie le status d'une tâche grâce à son ID et clé d'API
    static modifierStatus(cleApi = "", tache_id = -1, complete = false) {
        return new Promise((resolve, reject) => {
            const requete = `
            UPDATE ${this.nom_table} t
                SET complete = $1::boolean 
                    WHERE t.utilisateur_id = (
                        SELECT u.id
                        FROM ${Utilisateur.nom_table} u 
                        WHERE u.cle_api = $2::text
                    ) AND id = $3::int
                RETURNING *;
            `;
            const parametres = [complete, cleApi, tache_id];

            sql.query(requete, parametres, (erreur, resultat) => {
                if (erreur) {
                    return reject(new Error(`Erreur sqlState ${erreur.code} : ${erreur.message}`));
                }

                if (resultat.rowCount === 0) {
                    return reject(new HttpError("La tâche n'a pas été trouvée.", 404));
                }

                resolve(resultat.rows);
            });
        });
    }

    // Supprimer une tâche pour l'utilisateur
    static supprimer(cleApi = "", tache_id = -1) {
        return new Promise((resolve, reject) => {
            const requete = `
            DELETE FROM ${this.nom_table} t
                USING ${Utilisateur.nom_table} u
                WHERE t.id = $1::int AND t.utilisateur_id = u.id AND u.cle_api = $2::text;`;
            const parametres = [tache_id, cleApi];

            sql.query(requete, parametres, (erreur, resultat) => {
                if (erreur) {
                    return reject(new Error(`Erreur sqlState ${erreur.code} : ${erreur.message}`));
                }

                resolve(resultat);
            });
        });
    }

    // Trouve toutes les tâches avec la clé API
    static trouverTout(cleApi = "", complete = false) {
        return new Promise((resolve, reject) => {
            const completeStr = complete ? 'IS TRUE' : 'IS NOT TRUE';
            const requete = `SELECT t.id, t.titre FROM ${this.nom_table} t INNER JOIN ${Utilisateur.nom_table} u ON u.id = t.utilisateur_id WHERE u.cle_api = $1::text AND t.complete ${completeStr};`;
            const parametres = [cleApi];

            sql.query(requete, parametres, (erreur, resultat) => {
                if (erreur) {
                    return reject(new Error(`Erreur sqlState ${erreur.code} : ${erreur.message}`));
                }

                resolve(resultat.rows);
            });
        });
    }
}

module.exports = Tache;
