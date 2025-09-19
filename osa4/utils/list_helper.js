// 'dummy testi, joka palauttaa aina yhden'
const dummy = (blogs) => {
  return 1
}

// palauttaa blogien tykkäyksien summan
const totalLikes = (blogs) => {
    const amount = blogs.length

    if (amount === 0) return 0
    var result = 0

    for (var i = 0; i < amount; i++) {
        result += blogs[i].likes
    }

    return result
}

// palauttaa tykätyimmän blogin listasta
// palauttaa '0', jos lista on tyhjä
const favoriteBlog = (blogs) => {
    const amount = blogs.length

    if (amount === 0) return 0
    var result = 0
    var mostLikes = 0

    for (var i = 0; i < amount; i++) {
        if (blogs[i].likes > mostLikes) {
            result = i
            mostLikes = blogs[i].likes
        }
    }

    return blogs[result]
}

// Palauttaa kirjoittajan, jolla on eniten blogeja ja niiden määrän
const mostBlogs = (blogs) => {
    const amount = blogs.length

    if (amount === 0) return null

    var author = ""
    var count = 0

    var authorWithMostBlogs = null
    var mostBlogs = 0

    for (var i = 0; i < amount; i++) {
        author = blogs[i].author
        count = 0

        for (var j = 0; j < amount; j++) {
            if (blogs[j].author === author) {
                count += 1
            }
        }

        if (count > mostBlogs) {
            mostBlogs = count
            authorWithMostBlogs = author
        }
    }

    return {
        author: authorWithMostBlogs,
        blogs: mostBlogs
    }
}

// Palauttaa kirjoittajan, jolla on eniten blogitykkäyksiä ja niiden yhteenlasketun määrän
const mostLikes = (blogs) => {
    const amount = blogs.length

    if (amount === 0) return null

    var author = ""
    var count = 0

    var authorWithMostLikes = null
    var mostLikes = 0

    for (var i = 0; i < amount; i++) {
        author = blogs[i].author
        count = 0

        for (var j = 0; j < amount; j++) {
            if (blogs[j].author === author) {
                count += blogs[j].likes
            }
        }

        if (count > mostLikes) {
            mostLikes = count
            authorWithMostLikes = author
        }
    }

    return {
        author: authorWithMostLikes,
        likes: mostLikes
    }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}