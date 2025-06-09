const express = require('express')
const app = express()

app.use(express.json())

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
app.get('/', (request, response) => {
  response.send('<h1>Fullstack osa3</h1>')
})

// palauttaa henkilöt
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// palauttaa infon
app.get('/info', (request, response) => {
  const length = persons.length
  const date = new Date()

  response.send(`<p>Phonebook has info for ${length} people</p>
    <p>${date}</p>`)
})

// etsii tietyllä id numerolla henkilöä puhelinluettelosta (persons)
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person.number)
  } else {
    response.status(404).end()
  }
})

// poistaa numerotiedon
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body)

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const personExists = persons.find(person => person.name === body.name)

  if (personExists) {
    return response.status(400).json({
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

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})