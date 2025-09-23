// Kaikki blogien reittien määrittely

const blogsRouter = require('express').Router()
const { request } = require('express')
const Blog = require('../models/blog')
const { response } = require('../app')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

// hakee blogit tietokannasta
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
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
blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  /*
  if (!user) {
    // Etsii yhden käyttäjän
    user = await User.findOne({})
    if (!user) {
      return response.status(400).json({ error: 'no users found in db' })
    }
  }
  */

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  // jos 'title' tai 'url' puuttuu, hylätään tallentaminen ja palautetaan error 400 (Bad Request)
  if (!blog.title || !blog.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })

  // Muutettu populatedBlogiin (oli savedBlog)
  response.status(201).json(populatedBlog)
})

// poistaa blogin tietokannasta
blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found'})
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'blog can only be deleted by the creator' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

// blogin muokkaaminen
blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'blog can only be edited by the creator' })
  }

  const editedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    body,
    { new: true }
    ).populate('user', { username: 1, name: 1 })

  if (editedBlog) {
    response.json(editedBlog)
  } else {
    response.status(404).end()
  } 
})

module.exports = blogsRouter