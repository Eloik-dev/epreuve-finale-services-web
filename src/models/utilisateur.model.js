const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const sql = require("../config/db_pg.js");
const HttpError = require('../utils/HttpError.js');
const costFactor = 10;

class Utilisateur {
    static nom_table = "utilisateur";

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
        return new Promise(async (resolve, reject) => {
            if (!cleApi || cleApi.length == 0) {
                return resolve(false);
            }

            const requete = `SELECT * FROM ${this.nom_table} WHERE cle_api = $1::text;`;
            const parametres = [cleApi];

            sql.query(requete, parametres, (erreur, resultat) => {
                if (erreur) {
                    return reject(new Error(`Erreur sqlState ${erreur.code} : ${erreur.message}`));
                }
                if (resultat.rowCount > 0) {
                    return resolve(true);
                }

                resolve(false);
            });
        });
    }

    /**
     * Vérifie qu'un courriel est d'un format valide
     */
    static async estFormatCourrielValide(courriel = "") {
        if (!String(courriel)
            .toLowerCase()
            .match(
                /[^@]+@[^@]+\.[a-zA-Z]{2,6}$/
            )) {
            return true;
        }

        return false;
    }

    /**
     * Vérifie qu'un courriel est valide et n'existe pas déjà
     */
    static async validerCourriel(courriel = "") {
        return new Promise((resolve, reject) => {
            if (!this.estFormatCourrielValide(courriel)) {
                return new HttpError("Le courriel n'est pas d'un format valide.", 400);
            }

            sql.query(`SELECT * FROM ${this.nom_table} WHERE courriel = $1::text;`, [courriel], (erreur, resultat) => {
                if (erreur) {
                    return reject(new Error(`Erreur sqlState ${erreur.code} : ${erreur.message}`));
                }

                if (resultat.rowCount > 0) {
                    return reject(new HttpError("Ce courriel est déjà utilisé.", 400));
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
     * Créer un nouvel utilisateur
     */
    static creerUtilisateur(courriel = "", password = "") {
        return new Promise(async (resolve, reject) => {
            const requete = `INSERT INTO ${this.nom_table} (courriel, password, cle_api) VALUES ($1::text, $2::text, $3::text);`;
            const cle_api = this.genererCleApi();
            const hash = await this.creerHashPassword(password);
            const parametres = [courriel, hash, cle_api];

            sql.query(requete, parametres, (erreur) => {
                if (erreur) {
                    return reject(new Error(`Erreur sqlState ${erreur.code} : ${erreur.message}`));
                }

                resolve(cle_api);
            });
        });
    }

    /**
     * Vérifie qu'un hash est valide avec la base de données
     */
    static async validerHash(courriel = "", password = "") {
        return new Promise((resolve, reject) => {
            sql.query(`SELECT password FROM ${this.nom_table} WHERE courriel = $1::text;`, [courriel], async (erreur, resultat) => {
                if (erreur) {
                    return reject(new Error(`Erreur sqlState ${erreur.code} : ${erreur.message}`));
                }

                if (resultat.rowCount === 0) {
                    return reject(new HttpError("L'utilisateur n'a pas été trouvé.", 404));
                }

                const hash = resultat.rows[0]?.password;

                if (hash && !await bcrypt.compare(password, hash)) {
                    return reject(new HttpError("Le mot de passe est invalide.", 401))
                }

                resolve(true);
            });
        });
    }

    /**
     * Modifie la clé API d'un utilisateur
     */
    static async modifierCleApiUtilisateur(courriel = "", password = "") {
        return new Promise(async (resolve, reject) => {
            await this.validerHash(courriel, password).catch((erreur) => {
                reject(erreur);
            });
    
            const requete = `UPDATE ${this.nom_table} SET cle_api = $1::text WHERE courriel = $2::text;`;
            const cle_api = this.genererCleApi();
            const parametres = [cle_api, courriel];

            sql.query(requete, parametres, (erreur) => {
                if (erreur) {
                    return reject(new Error(`Erreur sqlState ${erreur.code} : ${erreur.message}`));
                }

                resolve(cle_api);
            });
        });
    }
}

module.exports = Utilisateur;
