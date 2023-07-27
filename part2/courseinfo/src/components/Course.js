const Header = ({name}) => {
    console.log({name});
  return(<h2>{name}</h2>)
  }
  
  const Part = ({part}) => {
    console.log(part)
    return(
      <li>{part.name} {part.exercises}</li>
    )
  }
  
  const Content = ({parts}) => {
    // mapping the exercise numbers to a single Array
    const exercises = parts.map(part => part.exercises)
    // using reduce to calculate the sum
    const total = exercises.reduce((sum, ex) => sum + ex, 0)
    console.log(exercises, total)
    return (
    <div>
    <ul>
      {parts.map(part => <Part key={part.id} part={part}/>)}
   </ul>
   <b>Total number of exercises: {total}</b>
   </div>
  )
    }
  
  
  const Course = ({course}) => {
    console.log({course});
  return(
  <div>
    <Header name={course.name}/>
      <Content parts={course.parts}/>
  </div>
  )
  }

  export default Course