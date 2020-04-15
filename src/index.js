const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const people = require('../People');

const PORT = process.env.PORT || 5000;

const app = express();

// Body parser middleware for POST requests
// allows us to 'decipher' what's being sent
app.use(express.json());
app.use(express.urlencoded({extended: false}));


// Handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// app middleware
app.use((req, res, next) => {
    console.log(`${new Date().toString()} --> ${req.originalUrl}`);
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next(); //call next function in the pipeline
});

app.get('/', (req, res) => res.render('index', {
    title: 'People API',
    subtitle: 'for the people',
    people: people,
}));

// start of middleware chain

// set static folder to avoid defining a seperate route every time
app.use(express.static('public'));

// use person router for requests with parent url: /api/person
// defining parent route also eliminates need to define it in file
app.use('/api/person', require('./routes/person'));

// Handler for 404 -- handles requests that have no middleware
app.use((req, res, next) => {
    res.status(404).send(`404: Not Found. We think you are lost!`);
    res.status(500).sendFile(path.join(__dirname, '../public/500.html'));
});

// Hanlder for errors thrown by server i.e. 500
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.sendFile(path.join(__dirname, '../public/500.html'));
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));