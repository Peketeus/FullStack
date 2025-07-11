import { useState, useEffect } from 'react'
import PersonForm from './PersonForm'
import Persons from './Persons'
import Filter from './Filter'
import personService from './services/persons'
import Notification from './Notification'

const App = () => {
  const [persons, setPersons] = useState([])

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)

    if (persons.some(person => person.name === newName && person.number !== newNumber)) {
      const conf = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)

      if (conf) {
        const personToUpdate = persons.find(person => person.name === newName)
        const updatedPerson = { ...personToUpdate, number: newNumber }

        personService
          .update(updatedPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(prevPersons =>
              prevPersons.map(p =>
                p.id === returnedPerson.id ? returnedPerson : p
              )
            )

            console.log('Updated persons:', persons);

            setNewName('')
            setNewNumber('')

            setErrorMessage(`Numero on päivitetty henkilölle ${returnedPerson.name}`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
          .catch(error => {
            console.error('Error while updating person ', error)
            setErrorMessage(
              `Information of ${personToUpdate.name} has already been removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          }) 
      }
      return
    }

    if (newName === '') {
      setErrorMessage(
        'Virheellinen syöte!'
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }

    if (persons.some(person => person.number === newNumber)) {

      // alert(`${newNumber} on jo puhelinluettelossa!`)

      setErrorMessage(
        `${newNumber} on jo puhelinluettelossa!`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }

    //-------------Tästä alas päin lisätään uusi----------------------------------------

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
      })

    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')

    setErrorMessage(`Lisätty: ${newName}`)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  const removePerson = (id) => {
    const person = persons.find(p => p.id === id);
    const confirmDelete = window.confirm(`Delete ${person.name}?`)

    if (confirmDelete) {
      personService.remove(id).then(() => {
        setPersons(persons.filter(person => person.id !== id));
        setNewName('')

        setErrorMessage(
          `${person.name} poistettu`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
      .catch(error => {
        console.error('Error deleting person:', error);
      });
    }
  }

  const shownPersons = filterName
    ? persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={errorMessage} />

      <Filter filterName={filterName} handleFilter={handleFilter} />

      <h3>Add a new</h3>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />

      <h3>Numbers</h3>

      {/*Tähän kohtaan lisätty Array.isArray errorin välttämiseksi. Komponentti saattaa latautua ennen useEffectin datan saamista*/}
      <Persons shownPersons={Array.isArray(shownPersons) ? shownPersons : []} removePerson={removePerson} />

    </div>
  )

}

export default App