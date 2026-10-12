import personModule from './personModule'
import { useEffect, useState } from 'react'

const Notification = ({ message, type }) => {
  if (message === '') {
    return null
  }

  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  )
}

const Filter = (props) => {
  return (
    <div> filter shown with <input value={props.filter} onChange={props.onChange} />
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <div>
        name: <input value={props.name} onChange={props.onNameChange} />
      </div>
      <div>
        number: <input value={props.number} onChange={props.onNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = (props) => {
  return (
    <div>
      {props.persons.map(person =>
        <div key={person.id}>
          {person.name} {person.number}
          <button onClick={() =>
            props.onDelete(person.id, person.name)}> delete
          </button>
        </div>
      )}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState('')
  const [notificationType, setNotificationType] = useState('')
  const showNotification = (message, type) => {
    setNotification(message)
    setNotificationType(type);

    setTimeout(() => {
      setNotification('')
      setNotificationType('')
    }, 5000)
  }

  useEffect(() => {
    personModule.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const alreadyAdded = persons.find(person => person.name === newName)
    if (alreadyAdded) {
      const replace = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (!replace) {
        return
      }
      const updatedPerson = { ...alreadyAdded, number: newNumber }
      personModule.update(alreadyAdded.id, updatedPerson).then(returnedPerson => {
        setPersons(persons.map(person => person.id === alreadyAdded.id ? returnedPerson : person))
        setNewName('')
        setNewNumber('')
        showNotification(`${returnedPerson.name} number changed`, 'success')
      }).catch(() => {
        showNotification(
          `Information of ${alreadyAdded.name} has already been removed from server`,
          'error'
        )
      })
      return
    }

    const person = { name: newName, number: newNumber }
    personModule.create(person).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
      showNotification(`${returnedPerson.name} added`, 'success')
    }).catch(() => {
      showNotification('Adding person failed', 'error')
    })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personModule
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          showNotification(`${name} deleted`, 'success')
        })
        .catch(() => {
          showNotification(
            `Information of ${name} has already been removed from server`,
            'error'
          )
        })
    }
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type={notificationType} />
      <Filter filter={filter} onChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm onSubmit={addPerson} name={newName} number={newNumber} onNameChange={handleNameChange} onNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons
        persons={personsToShow}
        onDelete={deletePerson}
      />
    </div>
  )

}

export default App