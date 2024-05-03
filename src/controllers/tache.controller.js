const SousTache = require("../models/sous-tache.model.js");
const Tache = require("../models/tache.model.js");
const Utilisateur = require("../models/utilisateur.model.js");
const HttpError = require("../utils/HttpError.js");

class TacheController {
    /**
     * Affiche toute les tâches pour un utilisateur
     */
    static async trouverTaches(req, res) {
        const { complete } = req.body;
        const cleApi = req.headers?.authorization.split(' ')[1];

        Utilisateur.validationCle(cleApi);
        const taches = await Tache.trouverTout(cleApi, complete === '1');

        res.status(200).json(taches);
    }

    /**
     * Affiche les détails d'une tâche ainsi que ses sous-tâches pour un utilisateur
     */
    static async trouverDetailsTache(req, res) {
        const { id } = req.body;

        if (id === undefined) {
            throw new HttpError("Vous devez spécifier un paramètre 'id' afin de trouver la tâche.", 400)
        }

        if (isNaN(Number(id))) {
            throw new HttpError("L'id de la tâche doit être un nombre (ex: 1, 3, 123).", 400)
        }

        const tache = await Tache.trouverParID(cleApi, Number(id));
        res.status(200).json({
            ...tache[0],
            sousTaches: await SousTache.trouverParTacheID(id)
        });
    }

    /**
     * Modifie le status d'une tâche pour un utilisateur
     */
    static async modifierStatusTache(req, res) {
        const { id, complete } = req.body;
        const cleApi = req.headers?.authorization.split(' ')[1];

        if (!Utilisateur.validationCle(cleApi)) {
            throw new HttpError("Aucune clé API n'a été passée.", 400);
        }

        if (id === undefined || id.length == 0) {
            throw new HttpError("Vous devez spécifier un paramètre 'id' afin de trouver la tâche à modifier.", 400)
        }

        if (isNaN(Number(id))) {
            throw new HttpError("L'id de la tâche doit être un nombre (ex: 1, 3, 123).", 400)
        }

        if (complete === undefined || complete.length == 0) {
            throw new HttpError("Vous devez spécifier un paramètre 'complete' comme nouveau status de la tâche.", 400)
        }

        if (isNaN(Number(complete))) {
            throw new HttpError("Le paramètre 'complete' de la tâche doit être un nombre 0 ou 1 .", 400)
        }

        const tache = await Tache.modifierStatus(cleApi, Number(id), complete);
        res.status(200).json(tache);
    }
}

module.exports = TacheController;