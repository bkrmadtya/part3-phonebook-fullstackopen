require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

app.use(express.static('build'));
app.use(cors());
app.use(bodyParser.json());

morgan.token('body', function(req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/', (request, response) => {
  response.send('<h1>Hello there</h1>');
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result.map(person => person.toJSON()));
  });
});

app.get('/info', (request, response) => {
  const result = `<div>
                <p>Phonebook has info for ${Person.length} people</p>
                <p>${Date()}</p>
            </div>`;

  response.send(result);
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  Person.findById(id).then(person => {
    response.json(person.toJSON());
  });
});

app.post('/api/persons', (request, response) => {
  const body = request.body;
  console.log(body);
  // const alreadyExist = Person.find({ name: body.name });

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    });
  }
  // else if (alreadyExist) {
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   });
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  });

  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON());
  });
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);

  persons = persons.filter(person => person.id !== id);

  response.status(204).end();
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
