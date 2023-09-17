const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const user = await User.findById(request.body.userId)

  if (user !== null) {
    let {userId, ...blogData} = request.body
    const blog = new Blog({...blogData, user: user.id})
    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    console.log(result)
    response.status(201).json(result)
  } else {
    console.log()
    response.status(400).json({ error: 'User provided does not exist' })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const newBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  })
  response.json(newBlog)
})

module.exports = blogsRouter
