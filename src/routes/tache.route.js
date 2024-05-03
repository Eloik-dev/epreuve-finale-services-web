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
router.post('/details', (req, res) => {
    TacheController.trouverDetailsTache(req, res);
});

/**
 * Route pour ajouter une tâche pour un utilisateur
 */
router.post('/ajouter', (req, res) => {
    TacheController.ajouterTache(req, res);
});

/**
 * Route pour modifier une tâche
 */
router.post('/modifier', (req, res) => {
    TacheController.modifierTache(req, res);
});

/**
 * Route pour modifier le status d'une tâche pour un utilisateur
 */
router.post('/modifier/status', (req, res) => {
    TacheController.modifierStatusTache(req, res);
});

/**
 * Route pour supprimer une tâche
 */
router.post('/supprimer', (req, res) => {
    TacheController.supprimer(req, res);
});

module.exports = router;
