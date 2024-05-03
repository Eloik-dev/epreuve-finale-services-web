const sql = require("../config/db_pg.js");

class Requete {
    constructor(table) {
        this.table = table;
    };

    static findAllWithKey(cleApi) {
        sql.query(`SELECT * FROM ${this.table};`, {}, (erreur, resultat) => {
            if (erreur) {
                console.log('Erreur sqlState : ' + erreur);
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }

            resolve(resultat.rows);
        });

    }
}

module.exports = Requete;
