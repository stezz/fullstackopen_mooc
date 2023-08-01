const express = require("express");
const morgan = require("morgan");
const cors = require("cors")

const app = express();
app.use(express.json());
app.use(cors())
// serving the static build with this
app.use(express.static('build'))
morgan.token("responseBody", function (res) {
  return JSON.stringify(res.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :responseBody"
  )
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

/* 
The json-parser functions so that it takes the JSON data of a request, 
transforms it into a JavaScript object and then attaches it to the body 
property of the request object before the route handler is called.
*/

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/info", (request, response) => {
  const personsAmount = persons.length;
  const now = Date();
  response.send(
    `Phonebook has info for ${personsAmount} people.<br/><br/>${now}`
  );
});

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log(id);

  const person = persons.find((person) => {
    console.log(person.id, typeof person.id, id, typeof id, person.id === id);
    return person.id === id;
  });

  if (person) {
    console.log(person);
    response.json(person);
  } else {
    response.statusMessage = "person does not exist";
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  console.log("current status of persons is now", persons);
  response.status(204).end();
});

const generateId = () => {
  return (id = Math.floor(Math.random() * 1000000));
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  if (persons.find((n) => n.name === body.name)) {
    console.log(body.name, "already existing");
    return response.status(400).json({
      error: `${body.name} already exists`,
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  response.json(person);
});
