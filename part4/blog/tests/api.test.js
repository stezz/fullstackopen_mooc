const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const Blog = require('../models/blog')
const User = require('../models/user')
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

describe('4.14', () => {
  test('We can update the blog title', async () => {
    const initialBlogs = await api.get('/api/blogs')
    const toUpdate = initialBlogs.body[0]
    toUpdate.title = 'A new title'
    await api.put(`/api/blogs/${toUpdate.id}`).send(toUpdate)
    const afterUpdate = await api.get(`/api/blogs/${toUpdate.id}`)
    expect(afterUpdate.body.title).toEqual('A new title')
  })

  test('We can update the blog url', async () => {
    const initialBlogs = await api.get('/api/blogs')
    const toUpdate = initialBlogs.body[0]
    toUpdate.url = 'https://anewurl.com'
    await api.put(`/api/blogs/${toUpdate.id}`).send(toUpdate)
    const afterUpdate = await api.get(`/api/blogs/${toUpdate.id}`)
    expect(afterUpdate.body.url).toEqual('https://anewurl.com')
  })

  test('We can update the blog author', async () => {
    const initialBlogs = await api.get('/api/blogs')
    const toUpdate = initialBlogs.body[0]
    toUpdate.author = 'A new author'
    await api.put(`/api/blogs/${toUpdate.id}`).send(toUpdate)
    const afterUpdate = await api.get(`/api/blogs/${toUpdate.id}`)
    expect(afterUpdate.body.author).toEqual('A new author')
  })

  test('We can update the blog likes', async () => {
    const initialBlogs = await api.get('/api/blogs')
    const toUpdate = initialBlogs.body[0]
    toUpdate.likes = 1234
    await api.put(`/api/blogs/${toUpdate.id}`).send(toUpdate)
    const afterUpdate = await api.get(`/api/blogs/${toUpdate.id}`)
    expect(afterUpdate.body.likes).toEqual(1234)
  })
})

describe('4.15 and 4.16', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
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

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation succeeds with a fresh username and a password longer than 3 chars', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'winnie',
      name: 'Winnie Pooh',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must be set')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails if password is shorter than 3 chars', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'winnie',
      name: 'Winnie Pooh',
      password: 'ba',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain(
      'password must be at least 3 chars long'
    )

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

describe('4.17', () => {
  let createdUser
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    const nonAdmin = new User({ username: 'guy', passwordHash })

    await user.save()
    createdUser = await nonAdmin.save()
  })

  test('new blog creation succeeds with user with proper ID', async () => {
    console.log(createdUser._id.toString())
    const newBlog = {
      ...helper.initialBlogs[0],
      userId: createdUser._id.toString(),
    }
    const beforePost = await api.get('/api/blogs')
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const afterPost = await api.get('/api/blogs')
    expect(afterPost.body.length).toEqual(beforePost.body.length + 1)
  })

  test('new blog creation fails with wrong user ID', async () => {
    const newBlog = {
      ...helper.initialBlogs[0],
      userId: '4506e30cdb6db28cac2bdc11',
    }

    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('User provided does not exist')
  })
})


describe('4.18', () => {
  let createdUser
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    const nonAdmin = new User({ username: 'guy', passwordHash })

    await user.save()
    createdUser = await nonAdmin.save()
  })

  test('login for a user succeeds', async () => {
    const response = await api
      .post('/api/login')
      .send({username: createdUser.username, password: 'sekret'})
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('login for a user with wrong password fails', async () => {
    const response = await api
      .post('/api/login')
      .send({username: createdUser.username, password: 'wrong'})
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

})

afterAll(async () => {
  await mongoose.connection.close()
})
