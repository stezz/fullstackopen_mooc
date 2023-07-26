import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const BestAnecdote = (votes) => {
  const best = votes.indexOf(Math.max(...votes))
  console.log("best anecdote in position", best)
  return (
    best
  )

}

const Display = (props) => <div>{props.anecdote}<br/>has {props.votes} votes<br/></div>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  } 

  const pickRandomAnecdote = (props) => {
    console.log("selected before", selected)
    const newSelected = getRandomInt(0, anecdotes.length)
    setSelected(newSelected)
    console.log("selected after", newSelected)
  }

  const updateVotes = () => {
    console.log("votes array before", votes)
    const newVotes = [ ...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
    console.log("votes array after", newVotes)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Display anecdote={anecdotes[selected]} votes={votes[selected]}/>
      <Button handleClick={pickRandomAnecdote} text='next anectode' />
      <Button handleClick={updateVotes} text='vote' />
      <h1>Anecdote with most votes so far</h1>
      <Display anecdote={anecdotes[BestAnecdote(votes)]} votes={votes[BestAnecdote(votes)]}/>

    </div>
  )
}

export default App