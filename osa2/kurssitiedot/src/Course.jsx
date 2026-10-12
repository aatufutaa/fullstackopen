const Header = ({ course }) => {
  return <h2>{course}</h2>
}

const Part = ({ part }) => {
  return <p>{part.name} {part.exercises}</p>
}

const Content = ({ parts }) => {
  return (
    <div>
      {
        parts.map(part => <Part key={part.name} part={part} />)
      }
    </div>
  )
}

const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <b> Number of exercises {total} </b>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course