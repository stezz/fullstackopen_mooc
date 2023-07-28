import { useState } from 'react'

const Person = ({ person }) => {
  return (
    <li>{person.name}</li>
  )
}


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const addPerson = (event) => {
    // handles the addition of a new person
    event.preventDefault()
    console.log("this is a new Person:", newName)
    if (persons.some((p) => p.name === newName)) {
      // checking if there is at least one instance of the newName 
      // existing already
      alert(`${newName} is already in the phonebook`)
    } else {
      console.log("we think that", newName, "is not here")
      setPersons(persons.concat({name: newName}))
    }
    setNewName("")
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>        
          name: <input value={newName}
          onChange={handleNameChange}/>
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