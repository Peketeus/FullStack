const express = require('express')
const morgan = require('morgan')

const app = express()

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body)
})

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

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-64-23122"
  }
]

// juuren GET pyyntö
app.get('/', (req, res) => {
  res.send('<h1>Fullstack osa3</h1>')
})

// palauttaa henkilöt
app.get('/api/persons', (req, res) => {
  res.json(persons)
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
  const id = req.params.id
  const person = persons.find(person => person.id === id)
  
  if (person) {
    res.json(person.number)
  } else {
    res.status(404).end()
  }
})

// poistaa numerotiedon
app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(person => person.id !== id)

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

  const personExists = persons.find(person => person.name === body.name)

  if (personExists) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const newId = Math.floor(Math.random() * 100001)

  const person = {
    id: String(newId),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})