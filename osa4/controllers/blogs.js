// Kaikki blogien reittien määrittely

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// hakee blogit tietokannasta
blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

// tallentaa blogit tietokantaan
blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

module.exports = blogsRouter