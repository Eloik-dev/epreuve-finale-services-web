const Utilisateur = require("../models/utilisateur.model.js");
const HttpError = require("../utils/HttpError.js");

class UtilisateurController {
    /**
     * Créer un nouvel utilisateur
     */
    static async creerUtilisateur(req, res) {
        const { courriel, password } = req.body;

         if (courriel === undefined || courriel.length == 0) {
            throw new HttpError("Vous devez spécifier un paramètre 'courriel' pour le nouveau utilisateur.", 400)
        }

        if (!Utilisateur.validationCourriel(courriel)) {
            throw new HttpError("Le paramètre 'courriel' n'est pas d'un format valide.", 400)
        }

        if (password === undefined || password.length == 0) {
            throw new HttpError("Vous devez spécifier un paramètre 'password' comme mot de passe du nouveau utilisateur.", 400)
        }

        res.status(200).send(await Utilisateur.creerUtilisateur(courriel, password));
    }
}

module.exports = UtilisateurController;