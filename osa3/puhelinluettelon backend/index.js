require('dotenv').config()                    // dotenv on tärkeää olla ensimmäisenä, että muuttujille on sisältö heti saatavilla
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
require('mongoose')

const app = express()

morgan.token('body', function (req) {
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

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

// luo uuden henkilön puhelinluetteloon ja tallentaa sen tietokantaan
app.post('/api/persons', (req, res, next) => {
  const body = req.body
  // console.log(body)

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

// juuren GET pyyntö
app.get('/', (req, res) => {
  res.send('<h1>Fullstack osa3</h1>')
})

// palauttaa henkilöt
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
    .catch(error => next(error))
})

// palauttaa infon (henkilöiden määrän ja ajan)
app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`)
    })
    .catch(error => next(error))
})

// etsii tietyllä id numerolla henkilöä puhelinluettelosta (persons)
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
    .catch(error => next(error))
})

// poistaa numerotiedon
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(res.status(204).end())
    .catch(error => next(error))
})

// numeron muokkaus
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' } // run validators vaatii oikean skeeman
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        res.json(updatedPerson)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})