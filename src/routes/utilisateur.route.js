const UtilisateurController = require('../controllers/utilisateur.controller');

const router = require('express').Router();

/**
 * Route pour l'ajout d'un utilisateur
 */
router.post('/creer', async (req, res, next) => {
    try {
        await UtilisateurController.creerUtilisateur(req, res);
    } catch (erreur) {
        next(erreur);
    }
});

/**
 * Route pour générer une nouvelle clé d'API pour un utilisateur
 */
router.put('/modifier/cle', async (req, res, next) => {
    try {
        await UtilisateurController.modifierCleApiUtilisateur(req, res);
    } catch (erreur) {
        next(erreur);
    }
});

module.exports = router;
