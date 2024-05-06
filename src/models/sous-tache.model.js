const sql = require("../config/db_pg.js");
const HttpError = require("../utils/HttpError.js");
const Tache = require("./tache.model.js");
const Utilisateur = require("./utilisateur.model.js");

class SousTache {
    static nom_table = "sous_tache";

    constructor(sousTache) {
        this.id = sousTache.id;
        this.tache_id = sousTache.tache_id;
        this.titre = sousTache.titre;
        this.complete = sousTache.complete;
    };

    // Trouve toutes les sous-tâches avec un ID de tâche
    static trouverParTacheID(tache_id = -1) {
        return new Promise((resolve) => {
            const requete = `SELECT * FROM ${this.nom_table} st WHERE st.tache_id = $1::int;`;
            const parametres = [tache_id];

            sql.query(requete, parametres, (erreur, resultat) => {
                if (erreur) {
                    return reject(new Error(`Erreur sqlState ${erreur.code} : ${erreur.message}`));
                }

                resolve(resultat.rows);
            });
        });
    }

    // Ajoute une sous-tâche pour une tâche
    static ajouter(tache_id, titre) {
        return new Promise((resolve, reject) => {
            const requete = `
            INSERT INTO ${this.nom_table} (tache_id, titre) VALUES (
                $1::int,
                $2::text
            ) RETURNING *;`;
            const parametres = [tache_id, titre];

            sql.query(requete, parametres, (erreur, resultat) => {
                if (erreur) {
                    console.log(erreur)
                    if (erreur.code == 23503) {
                        return reject(new HttpError("La tâche parent n'a pas été trouvée.", 404));
                    }

                    reject(new Error(`Erreur sqlState ${erreur.code} : ${erreur.message}`));
                } else {
                    resolve(resultat.rows);
                }
            });
        });
    }

    // Modifie une sous-tâche grâce à son ID et clé d'API
    static modifier(cleApi = "", id = -1, changements = {}) {
        return new Promise((resolve, reject) => {
            let setQuery = Object.keys(changements).map((key, index) => `${key} = $${index + 1}`).join(", ");
            const count_changements = Object.keys(changements).length;

            const requete = `
            UPDATE ${this.nom_table} st
                SET ${setQuery}
                WHERE tache_id IN (
                    SELECT t.id 
                    FROM ${Tache.nom_table} t
                    INNER JOIN ${Utilisateur.nom_table} u ON t.utilisateur_id = u.id
                    WHERE u.cle_api = $${count_changements + 1}::text
                ) AND id = $${count_changements + 2}::int
                RETURNING *;`;
            const parametres = [...Object.values(changements), cleApi, id];

            sql.query(requete, parametres, (erreur, resultat) => {
                if (erreur) {
                    return reject(new Error(`Erreur sqlState ${erreur.code} : ${erreur.message}`));
                }

                if (resultat.rowCount === 0) {
                    return reject(new HttpError("La sous-tâche n'a pas été trouvée.", 404));
                }

                resolve(resultat.rows);
            });
        });
    }

    // Modifie le status d'une sous-tâche grâce à son ID
    static modifierStatus(cleApi = "", id = -1, complete = false) {
        return new Promise((resolve, reject) => {
            const requete = `
            UPDATE ${this.nom_table} st
                SET complete = $1::boolean 
                    WHERE tache_id IN (
                        SELECT t.id 
                        FROM ${Tache.nom_table} t
                        INNER JOIN ${Utilisateur.nom_table} u ON t.utilisateur_id = u.id
                        WHERE u.cle_api = $2::text
                    ) AND id = $3::int
                RETURNING *;`;
            const parametres = [complete, cleApi, id];

            sql.query(requete, parametres, (erreur, resultat) => {
                if (erreur) {
                    return reject(new Error(`Erreur sqlState ${erreur.code} : ${erreur.message}`));
                }

                if (resultat.rowCount === 0) {
                    return reject(new HttpError("La sous-tâche n'a pas été trouvée.", 404));
                }

                resolve(resultat.rows);
            });
        });
    }

    // Supprimer une tâche pour l'utilisateur
    static supprimer(cleApi = "", id = -1) {
        return new Promise((resolve, reject) => {
            const requete = `
            DELETE FROM ${this.nom_table} st
                USING ${Utilisateur.nom_table} u, ${Tache.nom_table} t
                WHERE st.id = $1::int AND t.utilisateur_id = u.id AND st.tache_id = t.id AND u.cle_api = $2::text;`;
            const parametres = [id, cleApi];

            sql.query(requete, parametres, (erreur, resultat) => {
                if (erreur) {
                    return reject(new Error(`Erreur sqlState ${erreur.code} : ${erreur.message}`));
                }

                if (resultat.rowCount === 0) {
                    return reject(new HttpError("La sous-tâche n'a pas été trouvée.", 404));
                }

                resolve(resultat);
            });
        });
    }
}

module.exports = SousTache;