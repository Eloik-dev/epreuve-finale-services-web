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
        '/utilisateur/creer': {
            get: {
                tags: ['Utilisateurs'],
                summary: 'Créer un utilisateur avec un courriel et un mot de passe. Retourne une clé pour accéder à l\'API',
                operationId: 'creerUtilisateur',
                parameters: [
                    {
                        name: 'courriel',
                        in: 'query',
                        description: 'Un courriel dans un format valide',
                        required: true,
                        schema: {
                            type: 'string',
                            default: 'email@example.com'
                        }
                    }
                ],
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
        '/taches/afficher': {
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
        '/taches/details': {
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
                        description: 'Erreur lors de la récupération des détails de la tâche'
                    },
                    '500': {
                        description: 'Une erreur système est survenue, veuillez reéssayer plus tard.'
                    }
                }
            }
        },
        '/taches/ajouter': {
            post: {
                tags: ['Tâches'],
                summary: 'Ajoute une tâche pour un utilisateur',
                operationId: 'ajouterTache',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    titre: {
                                        type: 'string',
                                        description: 'Entrez le titre de la tâche à ajouter',
                                        default: 'Nouvelle tâche'
                                    },
                                    description: {
                                        type: 'string',
                                        description: 'Entrez la description de la tâche à ajouter',
                                        default: 'Description de la nouvelle tâche'
                                    },
                                    date_debut: {
                                        type: 'string',
                                        description: 'Entrez la date de début de la tâche à ajouter',
                                        default: '2024-05-04'
                                    },
                                    date_echeance: {
                                        type: 'string',
                                        description: 'Entrez la date d\'échéance de la tâche à ajouter',
                                        default: '2024-05-10'
                                    },
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Tâche ajoutée avec succès'
                    },
                    '400': {
                        description: 'Erreur lors de l\'ajout de la tâche'
                    },
                    '500': {
                        description: 'Une erreur système est survenue, veuillez reéssayer plus tard.'
                    }
                }
            }
        },
        '/taches/modifier': {
            put: {
                tags: ['Tâches'],
                summary: 'Modifie une tâche',
                operationId: 'modifierTache',
                responses: {
                    '200': {
                        description: 'Tâche modifiée avec succès'
                    },
                    '400': {
                        description: 'Erreur lors de la modification de la tâche'
                    },
                    '500': {
                        description: 'Une erreur système est survenue, veuillez reéssayer plus tard.'
                    }
                }
            }
        },
        '/taches/modifier/status': {
            put: {
                tags: ['Tâches'],
                summary: 'Modifie le status d\'une tâche pour un utilisateur',
                operationId: 'modifierStatusTache',
                responses: {
                    '200': {
                        description: 'Status de la tâche modifié avec succès'
                    },
                    '400': {
                        description: 'Erreur lors de la modification du status de la tâche'
                    },
                    '500': {
                        description: 'Une erreur système est survenue, veuillez reéssayer plus tard.'
                    }
                }
            }
        },
        '/taches/supprimer': {
            delete: {
                tags: ['Tâches'],
                summary: 'Supprime une tâche',
                operationId: 'supprimerTache',
                responses: {
                    '200': {
                        description: 'Tâche supprimée avec succès'
                    },
                    '400': {
                        description: 'Erreur lors de la suppression de la tâche'
                    },
                    '500': {
                        description: 'Une erreur système est survenue, veuillez reéssayer plus tard.'
                    }
                }
            }
        },
        '/soustaches/supprimer': {
            delete: {
                tags: ['Tâches'],
                summary: 'Supprime une tâche',
                operationId: 'supprimerTache',
                responses: {
                    '200': {
                        description: 'Tâche supprimée avec succès'
                    },
                    '400': {
                        description: 'Erreur lors de la suppression de la tâche'
                    },
                    '500': {
                        description: 'Une erreur système est survenue, veuillez reéssayer plus tard.'
                    }
                }
            }
        }
    }
};

module.exports = documentation;