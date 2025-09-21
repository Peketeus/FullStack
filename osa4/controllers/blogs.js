// Kaikki blogien reittien määrittely

const blogsRouter = require('express').Router()
const { request } = require('express')
const Blog = require('../models/blog')
const { response } = require('../app')

// hakee blogit tietokannasta
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

// hakee yksittäisen blogin tietokannasta
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

// tallentaa blogit tietokantaan
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })

  // jos 'title' tai 'url' puuttuu, hylätään tallentaminen ja palautetaan error 400 (Bad Request)
  if (!blog.title || !blog.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

// poistaa blogin tietokannasta
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

// blogin muokkaaminen
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const editedBlog = await Blog.findByIdAndUpdate(request.params.id, body, { new: true })

  if (editedBlog) {
    response.json(editedBlog)
  } else {
    response.status(404).end()
  } 
})

module.exports = blogsRouter