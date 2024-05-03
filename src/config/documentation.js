require('dotenv').config();

const documentation = {
    openapi: '3.1.0',
    info: {
        title: 'Projet final Éloïk Rousseau',
        summary: 'Une application de liste de tâches.',
        description: "Cette application est un service web permettant à ses utilisateurs de gérer efficacement leurs listes de tâches. Les utilisateurs peuvent se créer un compte afin de reçevoir une clé API unique pour accéder à ses propres données de manière sécurisée. Les fonctionnalités principales incluent la création, la modification et la suppression de tâches, ainsi que la possibilité d'ajouter des détails tels que la date de début, la date d'échéance, une description détaillée et des sous-tâches associées. Les tâches peuvent être marquées comme \"en cours\" ou \"terminée\", ce qui permet aux utilisateurs de suivre leur progression. Grâce à une interface conviviale et intuitive, le logiciel simplifie la gestion des tâches, aidant ainsi les utilisateurs à rester organisés et productifs.",
        contact: {
            name: 'Support pour l\'API',
            email: 'eloik.rousseau@gmail.com'
        },
        version: '1.0.0'
    },
    servers: [
        {
            url: process.env.HOST + process.env.PORT || 'http://localhost:3000',
            description: 'Serveur local'
        }
    ],
    components: {
        securitySchemes: {
            ApiKeyAuth: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: 'La clé API doit être fournie dans le format suivant : "cle_api {votre_clé_api}"'
            }
        }
    },
    security: [{
        ApiKeyAuth: [process.env.API_KEY]
    }]

};

module.exports = documentation;