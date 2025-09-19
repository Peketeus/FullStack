const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const emptyList = []

  const biggerList = [
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

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyList)
    assert.strictEqual(result, 0)
  })

  test('of abigger list is calculated', () => {
    const result = listHelper.totalLikes(biggerList)
    assert.strictEqual(result, 1523)
  }) 
})