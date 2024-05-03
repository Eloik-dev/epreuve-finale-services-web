const SousTache = require("../models/sous-tache.model.js");
const Tache = require("../models/tache.model.js");
const Utilisateur = require("../models/utilisateur.model.js");
const HttpError = require("../utils/HttpError.js");

class TacheController {

    /**
     * Modifie le status d'une tâche pour un utilisateur
     */
    static async modifierTache(req, res) {
        const { id, titre, description, date_debut, date_echeance, complete } = req.body;
        const cleApi = req.headers?.authorization.split(' ')[1];

        let changements = {};

        if (!Utilisateur.validationCle(cleApi)) {
            throw new HttpError("Aucune clé API n'a été passée.", 400);
        }

        let errors = [];

        // ID
        if (id === undefined || isNaN(Number(id))) {
            errors.push("Vous devez spécifier un paramètre 'id' valide afin de trouver la tâche à modifier. (ex: 1, 3, 123)");
        } else {
            changements.id = id;
        }

        // Titre
        if (titre !== undefined) {
            if (titre.length === 0) {
                errors.push("Vous devez spécifier un paramètre 'titre' valide comme nouveau titre de la tâche.");
            } else {
                changements.titre = titre;
            }
        }

        // Description
        if (description !== undefined) {
            if (description.length === 0) {
                errors.push("Vous devez spécifier un paramètre 'description' valide comme nouvelle description de la tâche.");
            } else {
                changements.description = description;
            }
        }

        // Date début
        if (date_debut !== undefined) {
            if (isNaN(new Date(date_debut))) {
                errors.push("Vous devez spécifier un paramètre 'date_debut' valide comme nouvelle date de début de la tâche. (ex: 2024-05-04)");
            } else {
                changements.date_debut = date_debut;
            }
        }

        // Date échéance
        if (date_echeance !== undefined) {
            if (isNaN(new Date(date_echeance))) {
                errors.push("Vous devez spécifier un paramètre 'date_echeance' valide comme nouvelle date d'échéance de la tâche. (ex: 2024-05-04)");
            } else {
                changements.date_echeance = date_echeance;
            }
        }

        // Complete
        if (complete !== undefined) {
            if (isNaN(Number(complete))) {
                errors.push("Vous devez spécifier un paramètre 'complete' valide comme nouveau status de la tâche. (0 ou 1)");
            } else {
                changements.complete = complete;
            }
        }

        if (errors.length > 0) {
            throw new HttpError(errors.join("\n"), 400);
        }

        const tache = await Tache.modifier(cleApi, Number(id), changements);
        res.status(200).json(tache);
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

        if (id === undefined || isNaN(Number(id))) {
            throw new HttpError("Vous devez spécifier un paramètre 'id' valide afin de trouver la tâche à modifier. (ex: 1, 3, 123)", 400);
        }

        if (complete === undefined || isNaN(Number(complete))) {
            throw new HttpError("Vous devez spécifier un paramètre 'complete' comme nouveau status de la tâche. (0 ou 1)", 400)
        }

        const tache = await Tache.modifierStatus(cleApi, Number(id), complete);
        res.status(200).json(tache);
    }

    /**
     * Supprime une tâche pour un utilisateur
     */
    static async supprimer(req, res) {
        const { id } = req.body;
        const cleApi = req.headers?.authorization.split(' ')[1];

        if (!Utilisateur.validationCle(cleApi)) {
            throw new HttpError("Aucune clé API n'a été passée.", 400);
        }

        if (id === undefined || isNaN(Number(id))) {
            throw new HttpError("Vous devez spécifier un paramètre 'id' valide afin de trouver la tâche à modifier. (ex: 1, 3, 123)", 400);
        }

        const suppression = await Tache.supprimer(cleApi, Number(id));

        if (suppression.rowCount == 1) {
            res.status(200).send("La tâche a été supprimée avec succès.");
        } else {
            res.status(404).send("La tâche n'a pas été trouvée.");
        }
    }
}

module.exports = TacheController;