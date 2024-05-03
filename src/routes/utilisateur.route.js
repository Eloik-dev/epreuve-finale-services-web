const UtilisateurController = require('../controllers/utilisateur.controller');

const router = require('express').Router();

/**
 * Route pour l'ajout d'un utilisateur
 */
router.get('/creer', (req, res) => {
    UtilisateurController.creerUtilisateur(req, res)
});

module.exports = router;
