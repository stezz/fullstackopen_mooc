const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { resourceUsage } = require('process')
const blogsRouter = require('./controllers/blogs')
require('dotenv').config()
const mongoUrl = process.env.MONGODB_URI

mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)




const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
