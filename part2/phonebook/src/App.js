import { useState } from 'react'

const Person = ({ person }) => {
  return (
    <li>Name: {person.name} - Number: {person.number}</li>
  )
}


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  // declaring a stateful filterTerm to be able to pass it around
  // there may be a better way but I don't know what
  const [filterTerm, setFilterTerm] = useState('')



  const addPerson = (event) => {
    // handles the addition of a new person
    event.preventDefault()
    console.log("this is a new Person:", newName)
    if (persons.some((p) => p.name === newName)) {
      // checking if there is at least one instance of the newName 
      // existing already
      alert(`${newName} is already in the phonebook`)
    } else {
      if (newNumber === "") {
        // checking if there is a number for this new contact
        alert(`please add a number for ${newName}`)
      } else {
      console.log("we think that", newName, "is not here")
      const maxId = Math.max(...persons.map(p => p.id))
      setPersons(persons.concat({name: newName, number: newNumber, id: maxId + 1}))
      // we intentionally clean both name and number only upon 
      // succesfull new entry
      setNewName("")
      setNewNumber("")
      }
    }

  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log("filter for", event.target.value)
    setFilterTerm(event.target.value)
  }

  // just a quick function to simplify the code below
  const lowerCaseFilter = (p) => p.name.toLowerCase().includes(filterTerm.toLowerCase())

  return (
    <div>
      <h2>Phonebook</h2>
      filter names <input onChange={handleFilterChange}/>


      <form onSubmit={addPerson}>
        <div>   
          <h2>Add a new number</h2>     
          <div>
            name: <input value={newName}
            onChange={handleNameChange}/>
          </div>
          <div>
            number: <input value={newNumber}
            onChange={handleNumberChange}/>
          </div>
          

        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
          {persons.filter(lowerCaseFilter).map(person =>
          <Person key={person.id} person={person} />
        )}
      </ul>
    </div>
  )
}

export default App