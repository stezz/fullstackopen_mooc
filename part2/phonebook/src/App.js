import { useState } from 'react'

const Person = ({ person }) => {
  return (
    <li>Name: {person.name} - Number: {person.number}</li>
  )
}


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: "050405060" }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')


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
      setPersons(persons.concat({name: newName, number: newNumber}))
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
  

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>        
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
          {persons.map(person =>
          <Person key={person.name} person={person} />
        )}
      </ul>
    </div>
  )
}

export default App