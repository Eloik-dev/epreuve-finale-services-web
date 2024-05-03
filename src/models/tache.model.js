const sql = require("../config/db_pg.js");
const HttpError = require("../utils/HttpError.js");

class Tache {
    constructor(tache) {
        this.id = tache.id;
        this.utilisateur_id = tache.utilisateur_id;
        this.titre = tache.titre;
        this.description = tache.description;
        this.date_debut = tache.date_debut;
        this.date_echeance = tache.date_echeance;
        this.complete = tache.complete;
        this.nom_table = "taches";
    };

    // Trouve une tâche avec un ID et une clé API
    static trouverParID(cleApi = "", tache_id = -1) {
        return new Promise((resolve) => {
            const requete = `SELECT t.* FROM taches t INNER JOIN utilisateur u ON u.cle_api = $1::text WHERE t.id = $2::int;`;
            const parametres = [cleApi, tache_id];

            sql.query(requete, parametres, (erreur, resultat) => {
                if (erreur) {
                    throw new Error(`Erreur sqlState ${erreur.code} : ${erreur.message}`);
                }

                resolve(resultat.rows);
            });
        });
    }

    // Modifie le status d'une tâche grâce à son ID et clé d'API
    static modifierStatus(cleApi = "", tache_id = -1, complete = false) {
        return new Promise((resolve) => {
            const requete = `
            UPDATE taches t
                SET complete = $1::boolean 
                    WHERE id IN (
                        SELECT t.id 
                        FROM utilisateur u 
                        WHERE u.cle_api = $2::text
                    ) AND id = $3::int
                RETURNING *;
            `;
            const parametres = [complete, cleApi, tache_id];

            sql.query(requete, parametres, (erreur, resultat) => {
                if (erreur) {
                    throw new Error(`Erreur sqlState ${erreur.code} : ${erreur.message}`);
                }

                resolve(resultat.rows);
            });
        });
    }

    // Trouve toutes les tâches avec la clé API
    static trouverTout(cleApi = "", complete = false) {
        return new Promise((resolve) => {
            const completeStr = complete ? 'IS TRUE' : 'IS NOT TRUE';
            const requete = `SELECT t.id, t.titre FROM taches t INNER JOIN utilisateur u ON u.cle_api = $1::text WHERE t.complete ${completeStr};`;
            const parametres = [cleApi];

            sql.query(requete, parametres, (erreur, resultat) => {
                if (erreur) {
                    throw new HttpError(`Erreur sqlState ${erreur.code} : ${erreur.message}`, erreur.code);
                }

                resolve(resultat.rows);
            });
        });
    }
}

module.exports = Tache;
