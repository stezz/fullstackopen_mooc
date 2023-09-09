const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'This is a cool blog post',
    author: 'Winnie Pooh',
    url: 'https://something.com/blog/article',
    likes: 4,
  },
  {
    title: 'That is a blog post',
    author: 'Pooh Pooh',
    url: 'https://something.com/blog/article2',
    likes: 5,
  },
  {
    title: 'This is NOT a blog post',
    author: 'Freddie Krueger',
    url: 'https://freddie.com/blog/Krueger',
    likes: 0,
  },
]

const nonExistingId = async () => {
  const blog = new blog({
    title: 'willremovethissoon',
    author: 'Nobody',
    url: 'https://deletethigs.com/blog/article2',
    likes: 0,
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
}
