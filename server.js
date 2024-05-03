const bodyParser = require('body-parser');
const express = require('express');
const authentification = require('./src/middlewares/authentification.middleware');
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const documentation = require('./src/config/documentation');

const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Demo API"
};

const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/taches', authentification);

app.use('/taches', require('./src/routes/tache.route'));
app.use('/utilisateur', require('./src/routes/utilisateur.route'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(documentation, swaggerOptions));

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));