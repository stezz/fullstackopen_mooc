import { useState } from 'react'

const Button = (props) => {
  //console.log('Rendering Button with text', props.text)
  
  return (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
  )
  }

const StatisticLine = (props) => {
  return(
    <tr>
      <td>
        {props.text}: {props.value}
      </td>
    </tr>
  )
}
const Statistics = (props) => {
    //console.log('Rendering Button with text', props.text)
    
    if (props.total > 0) {
      return (
        <div>
          <h1>Statistics</h1>
          <table>
            <tbody>
          <StatisticLine text="good" value={props.good} />
          <StatisticLine text="bad" value={props.bad} />
          <StatisticLine text="neutral" value={props.neutral} />
          <StatisticLine text="total" value={props.total} />
          <StatisticLine text="average" value={props.average} />
          <StatisticLine text="positive" value={props.positive+"%"} />
          </tbody>
          </table>
     </div> 
      )
    }
    else {
      return (
        <div>
          <h1>Statistics</h1>
            <p>No feedback given yet :(</p>
        </div> 
      )
    }
  }


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [points, setPoints] = useState(0)

  const updateGood = () => {
    console.log("good var is", good)
    const newGood = good + 1
    setGood(newGood)
    console.log("good var after is", newGood)
    console.log("points var is", points)
    console.log("total var is", total)
    const newPoints = points + 1
    const newTotal = total + 1
    setTotal(newTotal)
    setPoints(newPoints)
    console.log("points var after is", newPoints)
    console.log("total var after is", newTotal)

  }

  const updateBad = () => {
    console.log("bad var is", bad)
    const newBad = bad + 1    
    setBad(newBad)
    console.log("bad var after is", newBad)
    console.log("points var is", points)
    console.log("total var is", total)
    const newPoints = points - 1
    const newTotal = total + 1
    setTotal(newTotal)
    setPoints(newPoints)
    console.log("points var after is", newPoints)
    console.log("total var after is", newTotal)
  }

  const updateNeutral = () => {
    console.log("neutral var is", neutral)
    const newNeutral = neutral + 1 
    setNeutral(newNeutral)
    console.log("neutral var after is", newNeutral)
    console.log("total var is", total)
    const newTotal = total + 1
    setTotal(newTotal)
    // No need to update points here
  }

  return (
    <div>
      <h1>Please rate your experience with Helsinki Unicafe</h1>
      <Button handleClick={updateGood} text='good' />
      <Button handleClick={updateBad} text='bad' />
      <Button handleClick={updateNeutral} text='neutral' />
      <Statistics good={good} 
                    bad={bad}
                    neutral={neutral}
                    total={total}
                    average={points / total}
                    positive={good / total * 100} />
    </div>
  )
}

export default App