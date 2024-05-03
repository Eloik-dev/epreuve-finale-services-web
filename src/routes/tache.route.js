const TacheController = require('../controllers/tache.controller');

const router = require('express').Router();

/**
 * Route pour l'affichage des tâches complètes ou incomplètes pour un utilisateur
 */
router.get('/afficher', (req, res) => {
    TacheController.trouverTaches(req, res);
});

/**
 * Route pour l'affichage des détails d'une tâche pour un utilisateur
 */
router.get('/details', (req, res) => {
    TacheController.trouverDetailsTache(req, res);
});

/**
 * Route pour modifier le status d'une tâche pour un utilisateur
 */
router.get('/modifier/status', (req, res) => {
    TacheController.modifierStatusTache(req, res);
});

module.exports = router;
