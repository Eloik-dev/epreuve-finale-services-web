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

        await Utilisateur.validerCourriel(courriel);

        if (password === undefined || password.length == 0) {
            throw new HttpError("Vous devez spécifier un paramètre 'password' comme mot de passe du nouveau utilisateur.", 400)
        }

        const cle_api = await Utilisateur.creerUtilisateur(courriel, password)

        res.status(200).json({ cle_api });
    }

    /**
     * Génère une nouvelle clé API pour un utilisateur
     */
    static async modifierCleApiUtilisateur(req, res) {
        const { courriel, password } = req.body;

        if (courriel === undefined || courriel.length == 0) {
            throw new HttpError("Vous devez spécifier un paramètre 'courriel' pour l'utilisateur à modifier.", 400)
        }

        if (password === undefined || password.length == 0) {
            throw new HttpError("Vous devez spécifier un paramètre 'password' comme mot de passe de l'utilisateur à modifier.", 400)
        }

        const cle_api = await Utilisateur.modifierCleApiUtilisateur(courriel, password)

        res.status(200).json({ cle_api });
    }
}

module.exports = UtilisateurController;