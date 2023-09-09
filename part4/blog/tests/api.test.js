const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const { after } = require('lodash')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
  const promiseArray = blogObjects.map((blog) => blog.save())
  await Promise.all(promiseArray)
})

describe('4.8', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })
})

describe('4.9', () => {
  test('there is an id field', async () => {
    const response = await api.get('/api/blogs')
    console.log(response.body[0])
    expect(response.body[0].id).toBeDefined()
  })
})

describe('4.10', () => {
  test('a POST operation successfully creates a new blog', async () => {
    const newBlog = { ...helper.initialBlogs[0] }
    const beforePost = await api.get('/api/blogs')
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const afterPost = await api.get('/api/blogs')
    expect(afterPost.body.length).toEqual(beforePost.body.length + 1)
  })

  test('a POST operation creates exactly the blog we want', async () => {
    const newBlog = { ...helper.initialBlogs[0] }
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const createdBlog = await api.get(`/api/blogs/${response.body.id}`)
    // gotta delete the .id otherwise it doesn't match
    delete createdBlog.body.id
    expect(createdBlog.body).toEqual(newBlog)
  })
})

describe('4.11', () => {
  test('if the like property is missing it defaults to 0', async () => {
    const newBlog = { ...helper.initialBlogs[0] }
    delete newBlog.likes
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const createdBlog = await api.get(`/api/blogs/${response.body.id}`)
    // gotta delete the .id otherwise it doesn't match
    delete createdBlog.body.id
    expect(createdBlog.body.likes).toEqual(0)
  })
})

describe('4.12', () => {
  test('if the url property is missing it throws a 400 error', async () => {
    const newBlog = { ...helper.initialBlogs[0] }
    delete newBlog.url
    await api.post('/api/blogs').send(newBlog).expect(400)
  })

  test('if the title property is missing it throws a 400 error', async () => {
    const newBlog = { ...helper.initialBlogs[0] }
    delete newBlog.title

    await api.post('/api/blogs').send(newBlog).expect(400)
  })
})


describe('4.13', () => {
  test('a blog post is properly deleted', async () => {
    const beforeDelete = await api.get('/api/blogs')
    await api.delete(`/api/blogs/${beforeDelete.body[0].id}`)
    const afterDelete = await api.get('/api/blogs')
    expect(afterDelete.body.length).toEqual(beforeDelete.body.length - 1)
  })

  test('exactly the blog post we want is properly deleted', async () => {
    const beforeDelete = await api.get('/api/blogs')
    const idToDelete = beforeDelete.body[0].id
    await api.delete(`/api/blogs/${idToDelete}`)
    const afterDelete = await api.get('/api/blogs')
    ids = afterDelete.body.map((x) => x.id)
    expect(ids).not.toContain(idToDelete)
  })


})



afterAll(async () => {
  await mongoose.connection.close()
})
