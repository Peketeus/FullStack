const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('The most liked blog', () => {
    const listOfBlogs = [
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
        likes: 1000,
        __v: 3
    }
  ]

  const listOfBlogsWithEqualLikes = [
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

  const emptyList = []

  test('with list of blogs', () => {
    const result = listHelper.favoriteBlog(listOfBlogs)
    assert.deepStrictEqual(result, listOfBlogs[3])
  })

  test('with empty list', () => {
    const result = listHelper.favoriteBlog(emptyList)
    assert.deepStrictEqual(result, 0)
  })

  test('with list of blogs with equal likes', () => {
    const result = listHelper.favoriteBlog(listOfBlogsWithEqualLikes)
    assert.deepStrictEqual(result, listOfBlogsWithEqualLikes[1] || listOfBlogsWithEqualLikes[3])
  })
})