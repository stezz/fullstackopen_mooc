import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getPersons = () => {
    console.log('Getting persons from the server')
    const request = axios.get(baseUrl)
    return request.then(response => {
        console.log('promise fulfilled, returning data:', response.data)
        return response.data }
      )
  }

  const createPerson = newObject => {
    console.log('Creating a new person in the phonebook: ', newObject);
    const request = axios.post(baseUrl, newObject)
    console.log('This just happened:', request);
    return request.then(response => response.data)
  }

export default { getPersons, createPerson }