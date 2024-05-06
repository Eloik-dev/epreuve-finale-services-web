const SousTacheController = require('../controllers/sous-tache.controller');

const router = require('express').Router();

/**
 * Route pour ajouter une sous-tâche pour une tâche d'un utilisateur
 */
router.post('/ajouter', async (req, res, next) => {
    try {
        await SousTacheController.ajouterSousTache(req, res);
    } catch (erreur) {
        next(erreur)
    }
});

/**
 * Route pour modifier une tâche
 */
router.put('/modifier', async (req, res, next) => {
    try {
        await SousTacheController.modifierSousTache(req, res);
    } catch (erreur) {
        next(erreur)
    }
});

/**
 * Route pour modifier le status d'une tâche pour un utilisateur
 */
router.put('/modifier/status', async (req, res, next) => {
    try {
        await SousTacheController.modifierStatusSousTache(req, res);
    } catch (erreur) {
        next(erreur)
    }
});

/**
 * Route pour supprimer une tâche
 */
router.delete('/supprimer', async (req, res, next) => {
    try {
        await SousTacheController.supprimer(req, res);
    } catch (erreur) {
        next(erreur)
    }
});

module.exports = router;
