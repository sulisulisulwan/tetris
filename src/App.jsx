import React from 'react'
import PlayFieldGrid from './components/playfield/PlayFieldGrid.jsx'
import { NextQueue } from './random-generation/NextQueue.js'
import NextQueueDisplay from './NextQueueDisplay.jsx'
import StartQuitButton from './StartQuitButton.jsx'



// const nextQueue = new NextQueue()


class App extends React.Component {

  // const [ playField, setPlayField ] = useState(getInitialPlayField())
  

  constructor(props) {
    super(props)
    this.state = {
      playField: [],
      nextQueue: {},
      gamePhase: 'pregame',
      intervalId: 0
    }

    this.startQuitClickHandler = this.startQuitClickHandler.bind(this)
    this.queueEvent = this.queueEvent.bind(this)
  }
  
  /**
   * Builds the initial play field 
   * @returns Array of string array: 40 x 10
   */

  getInitialPlayField() {
    const initialPlayField = new Array(40).fill(null)
    return initialPlayField.map(row => new Array(10).fill('[_]', 0, 10))
  }

  startQuitClickHandler(e) {
    e.preventDefault()
    // may in the future implement "countdown" gamePhase

    if (this.state.gamePhase === 'pregame') {
      const id = this.setContinuousQueueEvent()
      this.setState({ gamePhase: 'generation', intervalId: id})
    } else {
      clearInterval(this.state.intervalId)
      this.setState({ gamePhase: 'pregame' })
    }
    
  }

  setContinuousQueueEvent() {
    
    return setInterval(this.queueEvent, 3000)
  }

  queueEvent() {

    this.state.nextQueue.dequeue()
    this.setState({ nextQueue: this.state.nextQueue})
  }

  componentDidMount() {

    const initializedNextQueue = new NextQueue()
    this.setState({ 
      playField: this.getInitialPlayField(),
      nextQueue: initializedNextQueue
    })
  }

  render() {
    return (
      <div>
        <div className="game-title">Tetris</div>
        <div className="playfield-and-nextqueue">
          <PlayFieldGrid playFieldData={this.state.playField.slice(20)}/>
          <NextQueueDisplay nextqueueData={this.state.nextQueue}/>
        </div>
        <StartQuitButton gamePhase={this.state.gamePhase} clickHandler={this.startQuitClickHandler}/>
      </div>
    )
  }
  
} 
export default App