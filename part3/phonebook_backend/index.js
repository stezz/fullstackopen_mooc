const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()

const Person = require("./models/person")

const app = express()

const PORT = process.env.PORT
app.use(express.json())
app.use(cors())
// serving the static build with this
app.use(express.static("build"))
morgan.token("responseBody", function (res) {
  return JSON.stringify(res.body)
})

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :responseBody"
  )
)

/* 
The json-parser functions so that it takes the JSON data of a request, 
transforms it into a JavaScript object and then attaches it to the body 
property of the request object before the route handler is called.
*/

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>")
})

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndUpdate(
    request.params.id,
    { number: request.body.number },
    // the option below returns the document _after_ it was update
    // otherwise it would return the doc _before_
    { new: true, runValidators: true, context: "query" }
  )
    .then((person) => {
      if (person) {
        console.log("person updated!")
        response.json(person)
      } else {
        console.log(person)
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.post("/api/persons", (request, response, next) => {
  const body = request.body
  if (body.name && body.number) {
    const person = new Person({
      name: body.name,
      number: body.number,
    })
    Person.findOne({ name: body.name }).then((existingPerson) => {
      if (!existingPerson) {
        person
          .save()
          .then((savedPerson) => {
            response.json(savedPerson)
          })
          .catch((error) => {
            console.log("this is the error", error)
            next(error)
          })
      } else {
        console.log("Person already existing in the DB")
        console.log("Found:", existingPerson)
        response.statusMessage = "Person already exists"
        response.status(400).end()
      }
    })
  } else {
    console.log("missing either name or number")
    response.statusMessage = "Provide both name and number"
    response.status(400).end()
  }
})

app.get("/api/info", (request, response) => {
  Person.find({}).then((persons) => {
    const now = Date()
    response.send(
      `Phonebook has info for ${persons.length} people.<br/><br/>${now}`
    )
  })
})

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((deletedPerson) => {
      if (deletedPerson) {
        console.log("deleted", deletedPerson.name)
        response.json(deletedPerson)
      } else {
        console.log("can't find the person with id", request.params.id)
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name == "ValidationError") {
    return response.status(400).json({ error: error })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
