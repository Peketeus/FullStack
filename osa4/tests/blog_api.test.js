const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { title } = require('node:process')

const api = supertest(app)

// ----------------------------BLOGIEN TESTAAMINEN--------------------------------------------

let token = null

// Lisää tietokantaan blogeja ja käyttäjiä
beforeEach(async () => {
    await Blog.deleteMany({})   // Tyhjentää testiblogit
    await User.deleteMany({})   // Tyhjentää testikäyttäjät

    const passwordHash = await bcrypt.hash('salasana', 10)
    const user = new User({ username: 'testuser', passwordHash })
    await user.save()

    // Sisäänkirjautuminen
    const login = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'salasana' })

    token = login.body.token

    // Blogeille omistaja
    const blogsWithUser = helper.initialBlogs.map(b => ({ ...b, user: user._id }))
    await Blog.insertMany(blogsWithUser)
})

describe('edition of blogs', () => {
    test('a spesific blog can be edited', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToEdit = blogsAtStart[0]

        // Blogi saa yhden tykkäyksen lisää
        const editedBlog = {
            title: blogToEdit.title,
            author: blogToEdit.author,
            url: blogToEdit.url,
            likes: blogToEdit.likes + 1
        }

        const result = await api
            .put(`/api/blogs/${blogToEdit.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(editedBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(result.body.likes, blogToEdit.likes + 1)

        const blogsAtEnd = await helper.blogsInDb()
        const edited = blogsAtEnd.find(b => b.id === blogToEdit.id)
        assert.strictEqual(edited.likes, blogToEdit.likes + 1)
    })
})

describe('deletion of blogs', () => {
    test('a blog can be deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

        const titles = blogsAtEnd.map(b => b.title)
        assert(!titles.includes(blogToDelete.title))
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
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

        const addedTitle = blogsAtEnd.map(b => b.title)
        assert.strictEqual(addedTitle.includes('Nyyläveljekset'), true)
    })

    test('without token', async () => {
        const newBlog = {
            title: 'Kurkkukeittoa',
            author: 'Kimmo ja Kari',
            url: 'kokkinurkkaus.html',
            likes: 999
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
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

        assert.strictEqual(resultBlog.body.title, blogToView.title)
        assert.strictEqual(resultBlog.body.author, blogToView.author)
        assert.strictEqual(resultBlog.body.url, blogToView.url)
        assert.strictEqual(resultBlog.body.likes, blogToView.likes)
        assert.strictEqual(resultBlog.body.id, blogToView.id)
        assert.strictEqual(resultBlog.body.user, blogToView.user.toString()) // blogToView.user on olio
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

    test('blog identifier is ID', async () => {
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
        .set('Authorization', `Bearer ${token}`)
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
            .set('Authorization', `Bearer ${token}`)
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
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
})

// ----------------KÄYTTÄJIEN TESTAAMINEN---------------------------------------

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'peketeus',
      name: 'JP',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
        username: 'op',
        name: 'testinimi',
        password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('`username`'))
    assert(result.body.error.includes('minimum allowed length'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
        username: 'Hienonimi',
        name: 'testinimi',
        password: 'sa'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('Password must be at least 3 characters long'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})