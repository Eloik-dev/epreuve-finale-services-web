const Utilisateur = require("../models/utilisateur.model");
const HttpError = require("../utils/HttpError");

/**
 * Vérifie la clé API de l'utilisateur
 */
const authentification = (req, res, next) => {
    try {
        const cle_api = req.headers?.authorization.split(' ')[1];
        
        if (!Utilisateur.validationCle(cle_api)) {
            throw new HttpError(`La clé d'API n'existe pas ou est invalide. (${cle_api})`, 401);
        }

        next();
    } catch (erreur) {
        if (erreur instanceof HttpError) {
            res.status(erreur.code).send(erreur.message);
        } else {
            console.error(erreur);
            res.status(500).send("Une erreur inconnue est survenue, veuillez réessayer plus tard.");
        }
    }
}

module.exports = authentification;