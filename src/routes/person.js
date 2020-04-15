const express = require('express');
const router = express.Router();
const people = require('../../People');
const uuid = require('uuid');

// using query property on the request object to send data associated with name
// /api/person?name=namerer&age=agerer
router.get('/', (request, response) => {
    if(request.query.name) {
        console.log(`Req method -- Asking for: ${request.query.name}`);
        response.json(people.filter(person => person.name === request.query.name));
    } else {
        console.log("Send everybody");
        response.json(people);
    }
});

// using params to get params in api request to send data associated with name
// /api/person/namerer
router.get('/:name', (request, response) => {
    console.log("using params");
    response.json(people.filter(person => person.name === request.params.name));
});

// error testing route
router.get('/err/or', (req, res) => {
    throw new Error(`This is an unhandled forced error`);
});

// CREATE person
router.post('/', (req, res) => {
    // verification for creation would be here?
    const newPerson = req.body;
    newPerson["age"] = parseInt(newPerson["age"]);
    newPerson["id"] = uuid.v4();
    people.push(newPerson);
    // res.status(200).json(people);
    res.redirect('/'); // go back to home page
});

// UPDATE person
router.put('/:id', (req, res) => {
    const personExists = people.some(person => person.id === parseInt(req.params.id));
    if(personExists) {
        people.map(person => {
            if(person.id === parseInt(req.params.id)) {
                person.name = req.body.name ? req.body.name : person.name;
                person.age = req.body.age ? parseInt(req.body.age) : person.age;
                person.occupation = req.body.occupation ? req.body.occupation : person.occupation;
                res.status(200).json(person);
            }
        });
    } else {
        res.status(400).json({"Error": "Person does not exist. Did you mean to create one?"});
    }
});

// DELETE person
router.delete('/:id', (req, res) => {
    // for the sake of the example, we're not modifying the original array
    // only returning what it would look like after 1 call
    res.status(200).json(people.filter(person => person.id !== parseInt(req.params.id)));
});

module.exports = router;