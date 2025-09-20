const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

// Lisää clusteriin blogeja
beforeEach(async () => {
    await Blog.deleteMany({})   // Tyhjentää testiblogin
    console.log('cleared')

    /*
    // Lisää kaikki blogit clusteriin
    for (let i = 0; i < helper.initialBlogs.length; i++) {
        let blogObject = new Blog(helper.initialBlogs[i])
        await blogObject.save()
        console.log('saved')
    }
    */
   console.log('adding blogs')
   await Blog.insertMany(helper.initialBlogs) // Lisää kaikki blogit tietokantaan
   console.log('done')
})



describe('deletion of blogs', () => {
    test('a blog can be deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        const contents = blogsAtEnd.map(b => b.content)
        assert(!contents.includes(blogToDelete.content))

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
})

describe('when blog is posted', () => {
    test('HTTP POST test', async () => {
        let response = await api.get('/api/blogs')
        let blogs = response.body

        assert.strictEqual(blogs.length, helper.initialBlogs.length)

        const newBlog = {
            title: "Nyyläveljekset",
            author: "Hunt Showdown",
            url: "www.istutaanpuskassa.html",
            likes: 1896
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

        const addedTitle = blogsAtEnd.map(b => b.title)
        assert.strictEqual(addedTitle.includes('Nyyläveljekset'), true)
    })
})

describe('when spesific blogs are returned', () => {
    test('a specific blog can be viewed', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToView = blogsAtStart[0]

        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.deepStrictEqual(resultBlog.body, blogToView)
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')

        const contents = response.body.map(e => e.title)
        assert.strictEqual(contents.includes('Go To Statement Considered Harmful'), true)
    })

    test('Blog identifier is ID', async () => {
        const response = await api.get('/api/blogs')
        const blogs = response.body

        blogs.forEach(blog => {
            assert.ok(blog.id, 'ID field is missing')
        })
    })
})

describe('when blogs are added without parameter', () => {
    test('new blog without likes has zero likes', async () => {
        const newBlog = {
            title: "Nyyläveljekset",
            author: "Hunt Showdown",
            url: "www.istutaanpuskassa.html"
        }

        const savedBlog = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        assert.strictEqual(savedBlog.body.likes, 0)
    })

    test('blog without title', async () => {
        const newBlog = {
            author: "Hunt Showdown",
            url: "www.istutaanpuskassa.html",
            likes: 1896
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('blog without url', async () => {
        const newBlog = {
            title: "Nyyläveljekset",
            author: "Hunt Showdown",
            likes: 1896
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
})

after(async () => {
  await mongoose.connection.close()
})