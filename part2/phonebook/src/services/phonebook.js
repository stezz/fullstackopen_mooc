import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getPersons = () => {
  console.log("Getting persons from the server");
  const request = axios.get(baseUrl);
  return request.then((response) => {
    console.log("promise fulfilled, returning data:", response.data);
    return response.data;
  });
};

const createPerson = (props) => {
  const {newObject,setNotification} = props
  console.log("Creating a new person in the phonebook: ", newObject);
  const request = axios.post(baseUrl, newObject)

  console.log("This just happened:", request);
  return request.then((response) => response.data)
  .catch(error => {
    setNotification(`${error} while updating ${newObject.name}`)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  });
  
};

const deletePerson = (props) => {
  const {id, setNotification} = props
  console.log("this is setNotification", setNotification);
  console.log("Deleting person with id", id);
  const request = axios.delete(`${baseUrl}/${id}`)
  console.log("This just happened:", request);
  return request.then((response) => response)
  .catch(error => {setNotification(`${error} while deleting person with id ${id}`)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
})}

const updatePerson = (props) => {
  const {newPerson, setNotification} = props
  console.log("Updating person with id", newPerson.id);
  console.log("we received this data", newPerson);
  const request = axios.put(`${baseUrl}/${newPerson.id}`, newPerson)
  console.log("This just happened:", request);
  return request.then((response) => response)
  .catch(error => {
    setNotification(`${error} while updating ${newPerson.name}`)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  })
};

export default { getPersons, createPerson, deletePerson, updatePerson };
