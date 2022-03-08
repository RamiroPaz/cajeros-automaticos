const express = require('express')
const cors = require('cors')

const cajerosRoutes = require('./routes/cajeros.routes')

const app = express()

// Middleware
app.use( cors() )
app.use( express.json() )

// Routes
app.use('/api', cajerosRoutes);


// handle undefined Routes
app.use('*', (req, res) => {
    res.status(404).send('Not Found')
});

module.exports = app;