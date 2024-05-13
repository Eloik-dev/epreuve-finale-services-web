const SousTache = require("../models/sous-tache.model.js");
const Tache = require("../models/tache.model.js");
const HttpError = require("../utils/HttpError.js");

class SousTacheController {
    /**
     * Ajoute une sous-tâche pour une tâche d'un utilisateur
     */
    static async ajouterSousTache(req, res) {
        const { tache_id, titre } = req.body;
        const cleApi = req.headers?.authorization.split(' ')[1];

        let errors = [];

        // Tâche ID
        if (tache_id === undefined || isNaN(Number(tache_id))) {
            errors.push("Vous devez spécifier un paramètre 'tache_id' valide afin de trouver la tâche à laquelle ajouter la sous-tâche (ex: 1, 3, 123).");
        }

        // Vérifier que la tâche appartient à l'utilisateur
        if ((await Tache.trouverParID(cleApi, tache_id)).length === 0) {
            throw new HttpError("La tâche spécifiée ne vous appartient pas.", 401);
        }

        // Titre
        if (titre === undefined || titre.length === 0) {
            errors.push("Vous devez spécifier un paramètre 'titre' valide comme titre de la nouvelle sous-tâche.");
        }

        if (errors.length > 0) {
            throw new HttpError(errors.join("\n"), 400);
        }

        res.status(200).json(await SousTache.ajouter(tache_id, titre));
    }

    /**
     * Modifie le status d'une sous-tâche pour un utilisateur
     */
    static async modifierSousTache(req, res) {
        const { id, titre } = req.body;
        const cleApi = req.headers?.authorization.split(' ')[1];

        let changements = {};

        let errors = [];

        // ID
        if (id === undefined || isNaN(Number(id))) {
            errors.push("Vous devez spécifier un paramètre 'id' valide afin de trouver la sous-tâche à modifier (ex: 1, 3, 123).");
        }

        // Titre
        if (titre !== undefined) {
            if (titre.length === 0) {
                errors.push("Vous devez spécifier un paramètre 'titre' valide comme nouveau titre de la sous-tâche.");
            } else {
                changements.titre = titre;
            }
        }

        if (errors.length > 0) {
            throw new HttpError(errors.join("\n"), 400);
        }

        res.status(200).json(await SousTache.modifier(cleApi, Number(id), changements));
    }

    /**
     * Modifie le status d'une sous-tâche pour un utilisateur
     */
    static async modifierStatusSousTache(req, res) {
        const { id, complete } = req.body;
        const cleApi = req.headers?.authorization.split(' ')[1];

        let errors = [];

        if (id === undefined || isNaN(Number(id))) {
            errors.push("Vous devez spécifier un paramètre 'id' valide afin de trouver la sous-tâche à modifier (ex: 1, 3, 123).");
        }

        if (complete === undefined || isNaN(Number(complete))) {
            errors.push("Vous devez spécifier un paramètre 'complete' comme nouveau status de la sous-tâche (0 ou 1).");
        }

        if (errors.length > 0) {
            throw new HttpError(errors.join("\n"), 400);
        }

        res.status(200).json(await SousTache.modifierStatus(cleApi, Number(id), complete));
    }

    /**
     * Supprime une sous-tâche pour un utilisateur
     */
    static async supprimer(req, res) {
        const { id } = req.query;
        const cleApi = req.headers?.authorization.split(' ')[1];

        if (id === undefined || isNaN(Number(id))) {
            throw new HttpError("Vous devez spécifier un paramètre 'id' valide afin de trouver la sous-tâche à supprimer (ex: 1, 3, 123).", 400);
        }

        await SousTache.supprimer(cleApi, Number(id));

        res.status(200).json({ message: "La sous-tâche a été supprimée avec succès." });
    }
}

module.exports = SousTacheController;