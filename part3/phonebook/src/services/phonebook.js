import axios from 'axios'
const baseUrl = '/api/persons'

const getPersons = () => {
  console.log('Getting persons from the server')
  const request = axios.get(baseUrl)
  return request.then((response) => {
    console.log('promise fulfilled, returning data:', response.data)
    return response.data
  })
}

const createPerson = (newObject) => {
  console.log('Creating a new person in the phonebook: ', newObject)
  const request = axios.post(baseUrl, newObject)

  console.log('This just happened:', request)
  return request.then((response) => response.data)
}

const deletePerson = (id) => {
  console.log('Deleting person with id', id)
  const request = axios.delete(`${baseUrl}/${id}`)
  console.log('This just happened:', request)
  return request.then((response) => response)
}

const updatePerson = (newPerson) => {
  console.log('Updating person with id', newPerson.id)
  console.log('we received this data', newPerson)
  const request = axios.put(`${baseUrl}/${newPerson.id}`, newPerson)
  console.log('This just happened:', request)
  return request.then((response) => response)
}

export default { getPersons, createPerson, deletePerson, updatePerson }
