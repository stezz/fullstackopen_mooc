const { log } = require('console')
var _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  console.log('lenght of the array is', blogs.length)
  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length > 0) {
    const likes = blogs.map((x) => x.likes)
    const maxLikes = Math.max.apply(null, likes)
    const result = (({ author, likes, title }) => ({ author, likes, title }))(
      blogs[likes.indexOf(maxLikes)]
    )
    console.log(result)
    return result
  } else {
    return []
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length > 0) {
    let blogsCount = _.countBy(blogs, 'author')
    let authorMost = _.max(Object.keys(blogsCount), (x) => {
      return blogsCount[x]
    })
    return { author: authorMost, blogs: blogsCount[authorMost] }
  } else {
    return []
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}
