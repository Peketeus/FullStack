const mongoose = require('mongoose')

// jos salasana puuttuu
if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

// estetään tyhjän nimen tai numeron lisääminen
if (process.argv.length === 4) {
  console.log('name or number missing from the argument')
  process.exit(1)
}

// estetään liian monen argumentin käyttö
if (process.argv.length > 5) {
  console.log('too many arguments')
  process.exit(1)
}

// argumentit komentoriville
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://p3keteus:${password}@cluster0.tdv1kfb.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number,
})

// pelkällä salasanalla tulostetaan puhelinluettelon sisältö
if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person.name, person.number)
  })
  mongoose.connection.close()
})}

// tallentaa uuden henkilön puhelinluetteloon jos argumenttien määrä täsmää
if (process.argv.length === 5) {
  person.save().then(result => {
  console.log('added', name, 'number', number, 'to phonebook')
  mongoose.connection.close()
})}