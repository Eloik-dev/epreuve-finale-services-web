const Utilisateur = require("../models/utilisateur.model");
const HttpError = require("../utils/HttpError");

/**
 * Vérifie la clé API de l'utilisateur
 */
const authentification = async (req, res, next) => {
    try {
        const authorization = req?.headers.authorization;

        if (authorization === undefined) {
            throw new HttpError("Aucune clé API n'a été passée.", 401);
        }

        const cle_api = authorization.split(' ')[1];

        if (!await Utilisateur.validationCle(cle_api)) {
            throw new HttpError(`La clé d'API n'existe pas ou est invalide. (${cle_api})`, 401);
        }

        next();
    } catch (erreur) {
        next(erreur)
    }
}

module.exports = authentification;