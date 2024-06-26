const SousTache = require("../models/sous-tache.model.js");
const Tache = require("../models/tache.model.js");
const HttpError = require("../utils/HttpError.js");

class TacheController {
    /**
     * Affiche toute les tâches pour un utilisateur
     */
    static async trouverTaches(req, res) {
        const { complete } = req.query;
        const cleApi = req.headers?.authorization.split(' ')[1];

        const taches = await Tache.trouverTout(cleApi, complete === '1');

        res.status(200).json(taches);
    }

    /**
     * Affiche les détails d'une tâche ainsi que ses sous-tâches pour un utilisateur
     */
    static async trouverDetailsTache(req, res) {
        const { id } = req.query;
        const cleApi = req.headers?.authorization.split(' ')[1];

        if (id === undefined || isNaN(Number(id))) {
            throw new HttpError("Vous devez spécifier un paramètre 'id' valide afin de trouver la tâche à modifier (ex: 1, 3, 123).", 400)
        }

        const tache = await Tache.trouverParID(cleApi, Number(id));

        if (tache.length === 0) {
            throw new HttpError("Aucune tâche n'a été trouvée.", 404)
        }

        res.status(200).json({
            ...tache[0],
            sousTaches: await SousTache.trouverParTacheID(id)
        });
    }

    /**
     * Ajoute une tâche pour un utilisateur
     */
    static async ajouterTache(req, res) {
        const { titre, description, date_debut, date_echeance } = req.body;
        const cleApi = req.headers?.authorization.split(' ')[1];

        let errors = [];

        // Titre
        if (titre === undefined || titre.length === 0) {
            errors.push("Vous devez spécifier un paramètre 'titre' valide comme nouveau titre de la tâche.");
        }

        // Description
        if (description === undefined || description.length === 0) {
            errors.push("Vous devez spécifier un paramètre 'description' valide comme nouvelle description de la tâche.");
        }

        // Date début
        if (date_debut === undefined || isNaN(new Date(date_debut))) {
            errors.push("Vous devez spécifier un paramètre 'date_debut' valide comme nouvelle date de début de la tâche. (ex: 2024-05-04)");
        }

        // Date échéance
        if (date_echeance === undefined || isNaN(new Date(date_echeance))) {
            errors.push("Vous devez spécifier un paramètre 'date_echeance' valide comme nouvelle date d'échéance de la tâche. (ex: 2024-05-04)");
        }

        if (errors.length > 0) {
            throw new HttpError(errors.join("\n"), 400);
        }

        const tache = await Tache.ajouter(cleApi, titre, description, date_debut, date_echeance);
        res.status(200).json(tache);
    }

    /**
     * Modifie le status d'une tâche pour un utilisateur
     */
    static async modifierTache(req, res) {
        const { id, titre, description, date_debut, date_echeance } = req.body;
        const cleApi = req.headers?.authorization.split(' ')[1];

        let changements = {};

        let errors = [];

        // ID
        if (id === undefined || isNaN(Number(id))) {
            errors.push("Vous devez spécifier un paramètre 'id' valide afin de trouver la tâche à modifier. (ex: 1, 3, 123)");
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

        let errors = [];

        if (id === undefined || isNaN(Number(id))) {
            errors.push("Vous devez spécifier un paramètre 'id' valide afin de trouver la tâche à modifier (ex: 1, 3, 123).");
        }

        if (complete === undefined || isNaN(Number(complete))) {
            errors.push("Vous devez spécifier un paramètre 'complete' comme nouveau status de la tâche (0 ou 1).");
        }

        if (errors.length > 0) {
            throw new HttpError(errors.join("\n"), 400);
        }

        const tache = await Tache.modifierStatus(cleApi, Number(id), complete);
        res.status(200).json(tache);
    }

    /**
     * Supprime une tâche pour un utilisateur
     */
    static async supprimer(req, res) {
        const { id } = req.query;
        const cleApi = req.headers?.authorization.split(' ')[1];

        if (id === undefined || isNaN(Number(id))) {
            throw new HttpError("Vous devez spécifier un paramètre 'id' valide afin de trouver la tâche à modifier. (ex: 1, 3, 123)", 400);
        }

        const suppression = await Tache.supprimer(cleApi, Number(id));

        if (suppression.rowCount != 1) {
            throw new HttpError("La tâche n'a pas été trouvée.", 404);
        }

        res.status(200).json({ message: "La tâche a été supprimée avec succès." });
    }
}

module.exports = TacheController;