const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))


let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

/* 
The json-parser functions so that it takes the JSON data of a request, 
transforms it into a JavaScript object and then attaches it to the body 
property of the request object before the route handler is called.
*/

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}



app.use(requestLogger)

const PORT = process.env.PORT || 3001

console.log("i got this port from process", process.env.PORT);
console.log("and I am using this port:", PORT);

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
app.get('/api/notes', (request, response) => {
    response.json(notes)
  })


app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)


    const note = notes.find(note => {
        console.log(note.id, typeof note.id, id, typeof id, note.id === id)
        return note.id === id
      })

      if (note) {
        console.log(note)
        response.json(note)
      } else {
        response.statusMessage = "Note does not exist"
        response.status(404).end()
      }
      

  })


app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
  })


  const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
  }
  
  app.post('/api/notes', (request, response) => {
    const body = request.body
  
    if (!body.content) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const note = {
      content: body.content,
      important: body.important || false,
      id: generateId(),
    }
  
    notes = notes.concat(note)
  
    response.json(note)
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)




app.listen(PORT, () => {
  console.log(`Official Server running on port ${PORT}`)
})
