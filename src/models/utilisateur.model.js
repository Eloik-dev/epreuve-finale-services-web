const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const sql = require("../config/db_pg.js");
const costFactor = 10;

class Utilisateur {
    constructor(utilisateur) {
        this.id = utilisateur.id;
        this.nom = utilisateur.nom;
        this.prenom = utilisateur.prenom;
        this.courriel = utilisateur.courriel;
        this.cle_api = utilisateur.cle_api;
        this.password = utilisateur.password;
    };

    /**
     * Vérifie qu'une clé API est valide
     */
    static validationCle(cleApi = "") {
        return new Promise(async (resolve) => {
            if (!cleApi || cleApi.length == 0) {
                resolve(false);
            }

            const requete = `SELECT COUNT(*) FROM utilisateur WHERE cle_api = $1::text;`;
            const parametres = [cleApi];

            sql.query(requete, parametres, (erreur, resultat) => {
                if (erreur) {
                    throw new Error(`Erreur sqlState ${erreur.code} : ${erreur.message}`);
                }

                const occurences = Number(resultat.rows.count);

                if (!isNaN(occurences) && occurences > 0) {
                    resolve(true);
                }

                resolve(false);
            });
        });
    }

    /**
     * Vérifie qu'un courriel est d'un format valide et n'existe pas déjà
     */
    static async validationCourriel(courriel = "") {
        return new Promise(async (resolve) => {
            sql.query(`SELECT COUNT(*) FROM utilisateur WHERE courriel = $1::text;`, [courriel], (erreur, resultat) => {
                if (erreur) {
                    throw new Error(`Erreur sqlState ${erreur.code} : ${erreur.message}`);
                }

                const occurences = Number(resultat.rows.count);
                if (!isNaN(occurences) && occurences > 0) {
                    resolve(false);
                }

                if (String(courriel)
                    .toLowerCase()
                    .match(
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    )) {
                    resolve(false);
                }

                resolve(true);
            });
        });
    }

    /**
     * Génère un hash à partir d'un mot de passe
     */
    static async creerHashPassword(password) {
        const salt = await bcrypt.genSalt(costFactor);
        return await bcrypt.hash(password, salt);
    }

    /**
     * Génère une clé API d'une longueur de 30 caractères
     */
    static genererCleApi() {
        let cle_api;

        do {
            cle_api = uuidv4().replace(/-/g, '').substring(0, 30);
        }
        while (!this.validationCle(cle_api))

        return cle_api;
    }

    /**
     * Créer un nouvel utilisateur en 
     */
    static creerUtilisateur(courriel = "", password = "") {
        return new Promise(async (resolve) => {
            const requete = `INSERT INTO utilisateur (courriel, password, cle_api) VALUES ($1::text, $2::text, $3::text);`;
            const cle_api = this.genererCleApi();
            const hash = await this.creerHashPassword(password);
            const parametres = [courriel, hash, cle_api];

            sql.query(requete, parametres, (erreur) => {
                if (erreur) {
                    throw new Error(`Erreur sqlState ${erreur.code} : ${erreur.message}`);
                }

                resolve(cle_api);
            });
        });
    }
}

module.exports = Utilisateur;
