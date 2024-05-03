const TacheController = require('../controllers/tache.controller');

const router = require('express').Router();

/**
 * Route pour l'affichage des tâches complètes ou incomplètes pour un utilisateur
 */
router.get('/afficher', async (req, res, next) => {
    try {
        await TacheController.trouverTaches(req, res);
    } catch (erreur) {
        next(erreur)
    }
});

/**
 * Route pour l'affichage des détails d'une tâche pour un utilisateur
 */
router.post('/details', async (req, res, next) => {
    try {
        await TacheController.trouverDetailsTache(req, res);
    } catch (erreur) {
        next(erreur)
    }
});

/**
 * Route pour ajouter une tâche pour un utilisateur
 */
router.post('/ajouter', async (req, res, next) => {
    try {
        await TacheController.ajouterTache(req, res);
    } catch (erreur) {
        next(erreur)
    }
});

/**
 * Route pour modifier une tâche
 */
router.post('/modifier', async (req, res, next) => {
    try {
        await TacheController.modifierTache(req, res);
    } catch (erreur) {
        next(erreur)
    }
});

/**
 * Route pour modifier le status d'une tâche pour un utilisateur
 */
router.post('/modifier/status', async (req, res, next) => {
    try {
        await TacheController.modifierStatusTache(req, res);
    } catch (erreur) {
        next(erreur)
    }
});

/**
 * Route pour supprimer une tâche
 */
router.post('/supprimer', async (req, res, next) => {
    try {
        await TacheController.supprimer(req, res);
    } catch (erreur) {
        next(erreur)
    }
});

module.exports = router;
