import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'


const Person = ({ person }) => {
  return (
    <li>Name: {person.name} - Number: {person.number}</li>
  )
}

const PersonForm = (props) => {
  console.log("Form props:", props)
  const handleNameChange = (event) => {
    console.log(event.target.value)
    props.setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    props.setNewNumber(event.target.value)
  }

  return (
    <form onSubmit={props.addPerson}>
    <div>   
      <h2>Add a new number</h2>     
      <div>
        name: <input value={props.newName}
        onChange={handleNameChange}/>
      </div>
      <div>
        number: <input value={props.newNumber}
        onChange={handleNumberChange}/>
      </div>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
    </form>
  )
}

const Filter = (props) => {
  console.log("Filter props:", props);
  const handleFilterChange = (event) => {
    console.log("filter for", event.target.value)
    props.setFilterTerm(event.target.value)
  }
  return (
  <div>filter names <input onChange={handleFilterChange}/></div>
  )
}

const Persons = (props) => {
  // just a quick function to simplify the code below
  const lowerCaseFilter = (p) => p.name.toLowerCase().includes(props.filterTerm.toLowerCase())
  return (
      <ul>
      {props.persons.filter(lowerCaseFilter).map(person =>
      <Person key={person.id} person={person} />
    )}
    </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  // declaring a stateful filterTerm to be able to pass it around
  // there may be a better way but I don't know what
  const [filterTerm, setFilterTerm] = useState('')
  
  const hook = () => {
    console.log('effect')
    phonebookService.getPersons()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
      })
  }

  useEffect(hook, [])
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
      // const maxId = Math.max(...persons.map(p => p.id))
      // const newPerson = {name: newName, number: newNumber, id: maxId + 1}
      const newPerson = {name: newName, number: newNumber}
      phonebookService.createPerson(newPerson)
        .then(returnedPerson => 
        setPersons(persons.concat(returnedPerson)))
      // we intentionally clean both name and number only upon 
      // succesfull new entry
      setNewName("")
      setNewNumber("")
      }
    }

  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterTerm={filterTerm} setFilterTerm={setFilterTerm} />
      <PersonForm setNewName={setNewName} 
                  newName={newName} setNewNumber={setNewNumber} 
                  newNumber={newNumber} addPerson={addPerson}
      /> 
      <h2>Numbers</h2>
      <Persons persons={persons} filterTerm={filterTerm}/>
    </div>
  )
}

export default App