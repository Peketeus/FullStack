const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('The author with most blogs', () => {
    const blogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 1
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 2
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 3
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 4
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 5
    }  
    ]

    const emptyListOfBlogs = []

    const listOfBlogsWithEqualAuthors = [
    {
        _id: '5a935843a788',
        title: 'Kissa istuu puussa',
        author: 'IT',
        url: 'hieno osoite',
        likes: 3,
        __v: 0
    },
    {
        _id: '5a9898934893a',
        title: 'Oispa kaljaa',
        author: 'Kelarotta',
        url: 'vielä hienompi osoite',
        likes: 420,
        __v: 1
    },
    {
        _id: '5a55a555454',
        title: 'Mene töihin',
        author: 'veronmaksaja',
        url: '404 url not found',
        likes: 100,
        __v: 2
    },
    {
        _id: '5a555555543333',
        title: 'Miten voi ottaa 2 pilleriä 3 kertaa päivässä?',
        author: 'Niilo22',
        url: 'http://www.Lempäälän_keisari.html',
        likes: 420,
        __v: 3
    }
  ]

    test('with list of blogs', () => {
        const result = listHelper.mostBlogs(blogs)
        const expected = {
            author: "Robert C. Martin",
            blogs: 3
        }
        assert.deepStrictEqual(result, expected)
    })

    test('with empty list of blogs', () => {
        const result = listHelper.mostBlogs(emptyListOfBlogs)
        assert.deepStrictEqual(result, null)
    })

    test('with with list of blogs with equal amount of authors', () => {
        const result = listHelper.mostBlogs(listOfBlogsWithEqualAuthors)
        const expected1 = {
            author: "IT",
            blogs: 1
        }
        const expected2 = {
            author: "Kelarotta",
            blogs: 1
        }
        const expected3 = {
            author: "veronmaksaja",
            blogs: 1
        }
        const expected4 = {
            author: "Niilo22",
            blogs: 1
        }
        assert.deepStrictEqual(result, expected1 || expected2 || expected3 || expected4)
    })
})