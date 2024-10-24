const Course = (props) => {
    console.log(props)
    const { course } = props
    return (
      <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
      </div>
    )
  }
  
  const Header = ({ course }) => {
    console.log(course)
    return (
      <h2>{course.name}</h2>
    )
  }
  
  const Content = ({ course }) => {
    return (
      <div>
        {course.parts.map(part => (
          <Part key={part.id} part={part} />
        ))}
      </div>
    )
  }
  
  const Part = ({ part }) => {
    console.log(part)
    return (
      <p>
        {part.name} {part.exercises}
      </p>
    )
  }
  
  const Total = ({ course }) => {
    const totalExercises = course.parts.reduce((sum, part) => {
      console.log('Yhteenlasku', part.exercises, '+', sum)
      return sum + part.exercises
    }, 0)
    console.log('Yhteensä', totalExercises)
  
    return (
      <h4>total of exercises {totalExercises}</h4>
    )
  }

  export default Course