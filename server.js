const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const authentification = require('./src/middlewares/authentification.middleware');
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const documentation = require('./src/config/documentation');
const HttpError = require('./src/utils/HttpError');

const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Demo API"
};

const PORT = process.env.PORT || 3000;

// Paramètrage
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Points d'accès API
app.use(['/api/tache', '/api/sous-tache'], authentification);
app.use('/api/tache', require('./src/routes/tache.route'));
app.use('/api/sous-tache', require('./src/routes/sous-tache.route'));
app.use('/api/utilisateur', require('./src/routes/utilisateur.route'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(documentation, swaggerOptions));

const stream = fs.createWriteStream(path.join(__dirname, 'erreur.log'), { flags: 'a' });

// Écrit toutes les erreurs 500 dans un fichier de log
app.use(morgan('combined', {
    skip: function (req, res) { return res.statusCode < 500 },
    stream
}));


// Catch-all pour traiter les erreurs custom et serveur
app.use((err, req, res, next) => {
    if (err instanceof HttpError) {
        res.status(err.code).json({ erreur: err.message });
    } else {
        console.log(err)
        res.status(500).json({ erreur: "Une erreur inconnue est survenue, veuillez réessayer plus tard." });
    }
});

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));