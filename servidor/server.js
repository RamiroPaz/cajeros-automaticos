const app = require('./app');
const dotenv = require('dotenv');
dotenv.config({
    path: './.env'
});

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION!!! shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log('Running at http://localhost:' + port)
})