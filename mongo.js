const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0-2x9ya.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true });

// Person schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

// Person model (so-called constructor) for Person schema
const Person = mongoose.model('Person', personSchema);

const addNewPerson = () => {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  });

  person.save().then(response => {
    console.log(`added ${person.name} ${person.number} to phonebook`);

    // connection should be closed at the end of the call back functions
    mongoose.connection.close();
  });
};

const printAllPerson = () => {
  Person.find({}).then(result => {
    console.log('phonebook:');
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });

    // connection should be closed at the end of the call back functions
    mongoose.connection.close();
  });
};

if (process.argv.length > 3) {
  addNewPerson();
} else {
  printAllPerson();
}
