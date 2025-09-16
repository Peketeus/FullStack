require('dotenv').config()                    // dotenv on tärkeää olla ensimmäisenä, että muuttujille on sisältö heti saatavilla
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const mongoose = require('mongoose')


// ------------------MongoDB------------------------------------------------------------
// ÄLÄ KOSKAAN TALLETA SALASANOJA GitHubiin!
/* Kommentoitu pois ja siirretty models.person.js tiedostoon
const password = process.argv[2]
const url = `mongodb+srv://p3keteus:${password}@cluster0.tdv1kfb.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// poistaa '_id' ja '__v' kentät
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)
*/
//--------------------------------------------------------------------------------------

const app = express()

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan((tokens, req, res) => {
  const log = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req. res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ]

  if (req.method === 'POST') {
    log.push(tokens.body(req, res))
  }

  return log.join(' ')
}))

let persons = []

// juuren GET pyyntö
// näkyy hostatessa render.com sivustolla
app.get('/', (req, res) => {
  res.send('<h1>Fullstack osa3</h1>')
})

// palauttaa henkilöt
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

// palauttaa infon
app.get('/info', (req, res) => {
  const length = persons.length
  const date = new Date()

  res.send(`<p>Phonebook has info for ${length} people</p>
    <p>${date}</p>`)
})

// etsii tietyllä id numerolla henkilöä puhelinluettelosta (persons)
app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    res.json(person)
  })
})

// poistaa numerotiedon
app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter((person) => person.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  // console.log(body)

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }

  // Luettelossa ei voi olla kahta henkilöä samalla nimellä. Frontendissä on tarkistin tälle, joka päivittää uuden numeron jo olemassa olevalle nimelle. Tarkista voiko poistaa!
  const personExists = persons.find(person => person.name === body.name)

  if (personExists) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  // const newId = Math.floor(Math.random() * 100001)

  /* Otettu pois tehtävässä 3.14
  const person = {
    id: String(newId),
    name: body.name,
    number: body.number,
  }
  */

  const person = new Person({
  name: body.name,
  number: body.number,
  })

  // Kommentoitu pois Osa3 Tietokannan käyttö reittien käsittelijöissä
  // persons = persons.concat(person)

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })

  // Kommentoitu pois Osa3 Tietokannan käyttö reittien käsittelijöissä
  // res.json(person)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})