const { log } = require('console')

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
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
