import { useState, useEffect } from "react";
import phonebookService from "./services/phonebook";

const Person = ({ person, handleDelete }) => {
  console.log("Person component got this person", person);

  return (
    <li>
      Name: {person.name} - Number: {person.number}
      <button type="button" onClick={handleDelete}>
        delete
      </button>
    </li>
  );
};


const PersonForm = (props) => {
  console.log("Form props:", props);
  const handleNameChange = (event) => {
    console.log(event.target.value);
    props.setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    props.setNewNumber(event.target.value);
  };

  return (
    <form onSubmit={props.addPerson}>
      <div>
        <h2>Add a new number</h2>
        <div>
          name: <input value={props.newName} onChange={handleNameChange} />
        </div>
        <div>
          number:{" "}
          <input value={props.newNumber} onChange={handleNumberChange} />
        </div>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Filter = (props) => {
  console.log("Filter props:", props);
  const handleFilterChange = (event) => {
    console.log("filter for", event.target.value);
    props.setFilterTerm(event.target.value);
  };
  return (
    <div>
      filter names <input onChange={handleFilterChange} />
    </div>
  );
};

const Persons = (props) => {
  // just a quick function to simplify the code below
  const lowerCaseFilter = (p) =>
    p.name.toLowerCase().includes(props.filterTerm.toLowerCase());

  const handleDelete = (person) => {
    if (window.confirm(`You sure you want to delete ${person.name} ?`)) {
      console.log("[handle delete] - deleting person with id", person.id);
      console.log("this is setNotification before we call deletePerson", props.setNotification);
      phonebookService.deletePerson(person.id).then((data) => {
        console.log("logging response data after delete:", data);
        if (data.status === 204 || data.status === 200) {
          console.log(`${person.name} deleted`);
          const newSetPersons = props.persons.filter((p) => p.id !== person.id);
          props.setPersons(newSetPersons);
          props.setNotification(`${person.name} was deleted from the phonebook`)
          setTimeout(() => {
            props.setNotification(null)
          }, 5000)
        } else {  
          console.log("we got a different status that we expected. Status:", data.status);
        }
      })
      .catch(error => {
        props.setError(`${error} while updating ${person.name}`)
        setTimeout(() => {
          props.setError(null)
        }, 5000)
      })
      ;
    }
  };

  return (
    <ul>
      {props.persons.filter(lowerCaseFilter).map((person) => (
        <Person
          key={person.id}
          person={person}
          handleDelete={() => handleDelete(person)}
        />
      ))}
    </ul>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  // declaring a stateful filterTerm to be able to pass it around
  // there may be a better way but I don't know what
  const [filterTerm, setFilterTerm] = useState("");
  const [notification, setNotification] = useState(null)  
  const [error, setError] = useState(null)



  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className='notification'>
        {message}
      </div>
    )
  }

  const ErrorNotification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className='error'>
        {message}
      </div>
    )
  }

  const hook = () => {
    console.log("effect");
    phonebookService.getPersons().then((initialPersons) => {
      console.log("promise fulfilled");
      setPersons(initialPersons);
    });
  };

  useEffect(hook, []);
  const addPerson = (event) => {
    // handles the addition of a new person
    event.preventDefault();
    console.log("this is a new Person:", newName);
    if (newNumber === "") {
      // checking if there is a number for this new contact
      alert(`please add a number for ${newName}`);
    } else {
      if (persons.some((p) => p.name === newName)) {
        const modPerson = persons.find((p) => p.name === newName);
        console.log("This person already exist but there is a new number");
        if (
          window.confirm(
            `A record for ${newName} already exist. You sure you want to change the number for ${newName} ?`
          )
        ) {
          const newPerson = { ...modPerson, number: newNumber };

          phonebookService.updatePerson(newPerson, setNotification()).then((returnedPerson) => {
            console.log("We got this person back", returnedPerson);
            const newData = persons.filter((p) => p.id !== modPerson.id);
            newData.push(newPerson);
            console.log(newData);
            setPersons(newData);
            setNotification(`${newName} was updated in the phonebook `)
            setNewName("");
            setNewNumber("");
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
          .catch(error => {
            setError(`${error} while updating ${newName}`
            )
            setTimeout(() => {
              setError(null)
            }, 5000)
          })
          ;
        }
      } else {
        if (newName === "") {
          alert(`please add a name for this number`);
        } else {
          console.log("we think that", newName, "is not here");
          // const maxId = Math.max(...persons.map(p => p.id))
          // const newPerson = {name: newName, number: newNumber, id: maxId + 1}
          const newPerson = { name: newName, number: newNumber };
          phonebookService
            .createPerson(newPerson)
            .then((returnedPerson) => {
              setPersons(persons.concat(returnedPerson))
              setNotification(`${newName} was added to the phonebook `)
              setNewName("");
              setNewNumber("");
              setTimeout(() => {
                setNotification(null)
              }, 5000)
            }
            )
            .catch(error => {
              setError(`${error} while creating ${newName}`
              )
              setTimeout(() => {
                setError(null)
              }, 5000)
            })

          // we intentionally clean both name and number only upon
          // succesfull new entry
          


        }
      }
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <ErrorNotification message={error} />
      <Filter filterTerm={filterTerm} setFilterTerm={setFilterTerm} />
      <PersonForm
        setNewName={setNewName}
        newName={newName}
        setNewNumber={setNewNumber}
        newNumber={newNumber}
        addPerson={addPerson}
        setPersons={setPersons}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        filterTerm={filterTerm}
        setPersons={setPersons}
        setNotification={setNotification}
        setError={setError}
      />
    </div>
  );
};

export default App;