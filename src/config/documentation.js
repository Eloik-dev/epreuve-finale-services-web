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
            url: process.env.HOST_PROD,
            description: 'Serveur hébergé'
        },
        {
            url: `${process.env.HOST_DEV}:${process.env.PORT}` || 'http://localhost:3000',
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
        ApiKeyAuth: []
    }],
    tags: [
        {
            name: 'Utilisateurs',
            description: 'Opérations liées aux utilisateurs'
        },
        {
            name: 'Tâches',
            description: 'Opérations liées aux tâches'
        },
        {
            name: 'Sous-Tâches',
            description: 'Opérations liées aux sous-tâches'
        }
    ],
    paths: {
        '/api/utilisateur/creer': {
            post: {
                tags: ['Utilisateurs'],
                summary: 'Créer un utilisateur avec un courriel et un mot de passe. Retourne une clé pour accéder à l\'API',
                operationId: 'creerUtilisateur',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    courriel: {
                                        type: 'string',
                                        description: 'Entrez un courriel dans un format valide',
                                        default: 'email@example.com'
                                    },
                                    password: {
                                        type: 'string',
                                        description: 'Entrez le mot de passe de l\'utilisateur à créer',
                                        default: 'Mot de passe'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Compte crée ave succès'
                    },
                    '400': {
                        description: 'Erreur lors de la création de l\'utilisateur',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            description: 'Message d\'erreur personnalisé'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Une erreur système est survenue, veuillez reéssayer plus tard.'
                    }
                }
            }
        },
        '/api/utilisateur/modifier/cle': {
            put: {
                tags: ['Utilisateurs'],
                summary: 'Génère une nouvelles clé d\'API pour un utilisateur. Retourne la clé générée pour accéder à l\'API',
                operationId: 'genererCleApiUtilisateur',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    courriel: {
                                        type: 'string',
                                        description: 'Entrez un courriel dans un format valide',
                                        default: 'email@example.com'
                                    },
                                    password: {
                                        type: 'string',
                                        description: 'Entrez le mot de passe de l\'utilisateur à créer',
                                        default: 'Mot de passe'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Clé modifiée avec succès'
                    },
                    '400': {
                        description: 'Erreur lors de la modification de la clé',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            description: 'Message d\'erreur personnalisé'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Une erreur système est survenue, veuillez reéssayer plus tard.'
                    }
                }
            }
        },
        '/api/tache/afficher': {
            get: {
                tags: ['Tâches'],
                summary: 'Affiche les tâches complètes ou incomplètes pour un utilisateur',
                operationId: 'trouverTaches',
                parameters: [
                    {
                        name: 'complete',
                        in: 'query',
                        description: '0 pour les tâches incomplètes, 1 pour les tâches complètes',
                        required: false,
                        schema: {
                            type: 'integer',
                            default: 0,
                            enum: [0, 1]
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Tâches récupérées avec succès'
                    },
                    '400': {
                        description: 'Erreur lors de la récupération des tâches',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            description: 'Message d\'erreur personnalisé'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Une erreur système est survenue, veuillez reéssayer plus tard.'
                    }
                }
            }
        },
        '/api/tache/details': {
            get: {
                tags: ['Tâches'],
                summary: 'Affiche les détails d\'une tâche pour un utilisateur',
                operationId: 'trouverDetailsTache',
                parameters: [
                    {
                        name: 'id',
                        in: 'query',
                        description: 'Entrez l\'ID de la tâche à afficher',
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Détails de la tâche récupérés avec succès'
                    },
                    '400': {
                        description: 'Erreur lors de la récupération des détails de la tâche',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            description: 'Message d\'erreur personnalisé'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Une erreur système est survenue, veuillez reéssayer plus tard.'
                    }
                }
            }
        },
        '/api/tache/ajouter': {
            post: {
                tags: ['Tâches'],
                summary: 'Ajoute une tâche pour un utilisateur',
                operationId: 'ajouterTache',
                parameters: [
                    {
                        name: 'titre',
                        in: 'query',
                        description: 'Entrez le titre de la tâche à ajouter',
                        required: true,
                        schema: {
                            type: 'string',
                            default: 'Nouvelle tâche'
                        }
                    },
                    {
                        name: 'description',
                        in: 'query',
                        description: 'Entrez la description de la tâche à ajouter',
                        required: true,
                        schema: {
                            type: 'string',
                            default: 'Description de la nouvelle tâche'
                        }
                    },
                    {
                        name: 'date_debut',
                        in: 'query',
                        description: 'Entrez la date de début de la tâche à ajouter',
                        required: true,
                        schema: {
                            type: 'string',
                            default: '2024-05-04'
                        }
                    },
                    {
                        name: 'date_echeance',
                        in: 'query',
                        description: 'Entrez la date d\'échéance de la tâche à ajouter',
                        required: true,
                        schema: {
                            type: 'string',
                            default: '2024-05-10'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Tâche ajoutée avec succès'
                    },
                    '400': {
                        description: 'Erreur lors de l\'ajout de la tâche',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            description: 'Message d\'erreur personnalisé'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Une erreur système est survenue, veuillez reéssayer plus tard.'
                    }
                }
            }
        },
        '/api/tache/modifier': {
            put: {
                tags: ['Tâches'],
                summary: 'Modifie une tâche',
                operationId: 'modifierTache',
                parameters: [
                    {
                        name: 'id',
                        in: 'query',
                        description: 'Entrez l\'ID de la tâche à modifier',
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    },
                    {
                        name: 'titre',
                        in: 'query',
                        description: 'Entrez le nouveau titre de la tâche à modifier',
                        required: false,
                        schema: {
                            type: 'string',
                            default: 'Nouvelle tâche'
                        }
                    },
                    {
                        name: 'description',
                        in: 'query',
                        description: 'Entrez la nouvelle description de la tâche à modifier',
                        required: false,
                        schema: {
                            type: 'string',
                            default: 'Description de la nouvelle tâche'
                        }
                    },
                    {
                        name: 'date_debut',
                        in: 'query',
                        description: 'Entrez la nouvelle date d\'échéance de la tâche à modifier',
                        required: false,
                        schema: {
                            type: 'string',
                            default: '2024-05-04'
                        }
                    },
                    {
                        name: 'date_echeance',
                        in: 'query',
                        description: 'Entrez le nouveau status de la tâche à modifier',
                        required: false,
                        schema: {
                            type: 'string',
                            default: '2024-05-10'
                        }
                    },
                    {
                        name: 'complete',
                        in: 'query',
                        description: 'Entrez le nouveau status de la tâche à modifier',
                        required: false,
                        schema: {
                            type: 'integer',
                            default: 0,
                            enum: [0, 1]
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Tâche modifiée avec succès'
                    },
                    '400': {
                        description: 'Erreur lors de la modification de la tâche',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            description: 'Message d\'erreur personnalisé'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Une erreur système est survenue, veuillez reéssayer plus tard.'
                    }
                }
            }
        },
        '/api/tache/modifier/status': {
            put: {
                tags: ['Tâches'],
                summary: 'Modifie le status d\'une tâche pour un utilisateur',
                operationId: 'modifierStatusTache',
                parameters: [
                    {
                        name: 'id',
                        in: 'query',
                        description: 'Entrez l\'ID de la tâche à modifier',
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    },
                    {
                        name: 'complete',
                        in: 'query',
                        description: 'Entrez le nouveau status de la tâche à modifier',
                        required: false,
                        schema: {
                            type: 'integer',
                            enum: [0, 1]
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Status de la tâche modifié avec succès'
                    },
                    '400': {
                        description: 'Erreur lors de la modification du status de la tâche',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            description: 'Message d\'erreur personnalisé'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Une erreur système est survenue, veuillez reéssayer plus tard.'
                    }
                }
            }
        },
        '/api/tache/supprimer': {
            delete: {
                tags: ['Tâches'],
                summary: 'Supprime une tâche',
                operationId: 'supprimerTache',
                parameters: [
                    {
                        name: 'id',
                        in: 'query',
                        description: 'Entrez l\'ID de la tâche à supprimer',
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Tâche supprimée avec succès'
                    },
                    '400': {
                        description: 'Erreur lors de la suppression de la tâche',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            description: 'Message d\'erreur personnalisé'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Une erreur système est survenue, veuillez reéssayer plus tard.'
                    }
                }
            }
        },
        '/api/sous-tache/ajouter': {
            post: {
                tags: ['Sous-Tâches'],
                summary: 'Ajoute une sous-tâche pour une tâche d\'un utilisateur',
                operationId: 'ajouterSousTache',
                parameters: [
                    {
                        name: 'tache_id',
                        in: 'query',
                        description: 'Entrez l\'ID de la tâche pour laquelle ajouté la sous-tâche.',
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    },
                    {
                        name: 'titre',
                        in: 'query',
                        description: 'Entrez le titre de la sous-tâche à ajouter.',
                        required: true,
                        schema: {
                            type: 'string',
                            default: 'Nouvelle sous-tâche'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Sous-tâche ajoutée avec succès'
                    },
                    '400': {
                        description: 'Erreur lors de l\'ajout de la sous-tâche',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            description: 'Message d\'erreur personnalisé'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Une erreur système est survenue, veuillez reéssayer plus tard.'
                    }
                }
            }
        },
        '/api/sous-tache/modifier': {
            put: {
                tags: ['Sous-Tâches'],
                summary: 'Modifie une sous-tâche',
                operationId: 'modifierSousTache',
                parameters: [
                    {
                        name: 'id',
                        in: 'query',
                        description: 'Entrez l\'ID de la sous-tâche à modifier',
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    },
                    {
                        name: 'titre',
                        in: 'query',
                        description: 'Entrez le nouveau titre de la sous-tâche à modifier',
                        required: false,
                        schema: {
                            type: 'string',
                            default: 'Nouvelle sous-tâche'
                        }
                    },
                    {
                        name: 'complete',
                        in: 'query',
                        description: 'Entrez le nouveau status de la sous-tâche à modifier',
                        required: false,
                        schema: {
                            type: 'integer',
                            default: 0,
                            enum: [0, 1]
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Sous-tâche modifiée avec succès'
                    },
                    '400': {
                        description: 'Erreur lors de la modification de la sous-tâche',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            description: 'Message d\'erreur personnalisé'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Une erreur système est survenue, veuillez reéssayer plus tard.'
                    }
                }
            }
        },
        '/api/sous-tache/modifier/status': {
            put: {
                tags: ['Sous-Tâches'],
                summary: 'Modifie le status d\'une sous-tâche pour un utilisateur',
                operationId: 'modifierStatusSousTache',
                parameters: [
                    {
                        name: 'id',
                        in: 'query',
                        description: 'Entrez l\'ID de la sous-tâche à modifier',
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    },
                    {
                        name: 'complete',
                        in: 'query',
                        description: 'Entrez le nouveau status de la sous-tâche à modifier',
                        required: false,
                        schema: {
                            type: 'integer',
                            enum: [0, 1]
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Status de la sous-tâche modifié avec succès'
                    },
                    '400': {
                        description: 'Erreur lors de la modification du status de la sous-tâche',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            description: 'Message d\'erreur personnalisé'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Une erreur système est survenue, veuillez reéssayer plus tard.'
                    }
                }
            }
        },
        '/api/sous-tache/supprimer': {
            delete: {
                tags: ['Sous-Tâches'],
                summary: 'Supprime une sous-tâche',
                operationId: 'supprimerSousTache',
                parameters: [
                    {
                        name: 'id',
                        in: 'query',
                        description: 'Entrez l\'ID de la sous-tâche à supprimer',
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Sous-tâche supprimée avec succès'
                    },
                    '400': {
                        description: 'Erreur lors de la suppression de la sous-tâche',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: {
                                            type: 'string',
                                            description: 'Message d\'erreur personnalisé'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Une erreur système est survenue, veuillez reéssayer plus tard.'
                    }
                }
            }
        },
    }
};

module.exports = documentation;