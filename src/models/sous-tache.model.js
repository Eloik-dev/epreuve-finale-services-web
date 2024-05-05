const sql = require("../config/db_pg.js");
const HttpError = require("../utils/HttpError.js");

class SousTache {
    constructor(sousTache) {
        this.id = sousTache.id;
        this.tache_id = sousTache.tache_id;
        this.titre = sousTache.titre;
        this.complete = sousTache.complete;
    };

    // Trouve toutes les sous-tâches avec la clé API
    static trouverParTacheID(tache_id = -1) {
        return new Promise((resolve) => {
            const requete = `SELECT st.* FROM sous_taches st INNER JOIN taches t ON t.id = $1::int;`;
            const parametres = [tache_id];

            sql.query(requete, parametres, (erreur, resultat) => {
                if (erreur) {
                    throw new HttpError(`Erreur sqlState ${erreur.code} : ${erreur.message}`, erreur.code);
                }

                resolve(resultat.rows);
            });
        });
    }

}

module.exports = SousTache;
