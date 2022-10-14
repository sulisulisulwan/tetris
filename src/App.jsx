import React from 'react'
import PlayFieldGrid from './components/playfield/PlayFieldGrid.jsx'
import { NextQueue } from './random-generation/NextQueue.js'
import NextQueueDisplay from './NextQueueDisplay.jsx'
import StartQuitButton from './StartQuitButton.jsx'
import { Animate, Completion, Eliminate, Falling, Generation, Iterate, Lock, Pattern, Pregame } from './engine/index.js'
class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      playField: this.getInitialPlayField(),
      nextQueue: new NextQueue(), // Danger with this one.  It holds state within the class, so we have to setState with this instantition for every update
      gamePhases: {
        animate: this.animatePhase,
        completion: this.completionPhase,
        eliminate: this.eliminatePhase,
        falling: this.fallingPhase,
        generation: this.generationPhase,
        iterate: this.iteratePhase,
        lock: this.lockPhase,
        pattern: this.patternPhase,
        pregame: this.pregamePhase
      },
      currentGamePhase: 'off',
      
      //Test state props
      intervalId: null,
      doesthiswork: 'nope',


      currentTetrimino: null
    }

    this.startQuitClickHandler = this.startQuitClickHandler.bind(this)
    this.generationPhase = this.generationPhase.bind(this)
    this.fallingPhase = this.fallingPhase.bind(this)
      this.setContinuousFallEvent = this.setContinuousFallEvent.bind(this)
      this.continuousFallEvent = this.continuousFallEvent.bind(this)
      this.playerKeystrokeHandler = this.playerKeystrokeHandler.bind(this)
  }

  getInitialPlayField() {
    const initialPlayField = new Array(40).fill(null)
    return initialPlayField.map(row => new Array(10).fill('[_]', 0, 10))
  }

  startQuitClickHandler(e) {
    e.preventDefault()
    // may in the future implement "countdown" gamePhase
    this.state.currentGamePhase === 'off' ?
      this.setState({ currentGamePhase: 'generation'}) : this.setState({ currentGamePhase: 'off' })
  }


  generationPhase() {
    const newCurrentTetrimino = this.state.nextQueue.dequeue()
    this.setState({ 
      nextQueue: this.state.nextQueue,
      currentTetrimino: newCurrentTetrimino,
      currentGamePhase: 'falling'
    })
  }

  fallingPhase() {
    if (this.state.intervalId === null) {
      this.setContinuousFallEvent()
    }
    //set a setInterval event for updating termino downward motion?  Whenever you click downward it clearsthe interval?
  }
        setContinuousFallEvent() {
          return setInterval(this.continuousFallEvent, 1000)
        }

        continuousFallEvent() {
          
        }
        playerKeystrokeHandler() {

        }

  componentDidMount() {
    console.log(' >>>>> App component mounted')
  }

  componentDidUpdate() {  
    const { currentGamePhase, gamePhases } = this.state
    const phaseHandler = gamePhases[currentGamePhase]
  }

  render() {

    return (
      <div>
        <div className="game-title">Tetris</div>
        <div className="playfield-and-nextqueue">
          <PlayFieldGrid playFieldData={this.state.playField.slice(20)}/>
          <NextQueueDisplay nextqueueData={this.state.nextQueue}/>
        </div>
        <StartQuitButton currentGamePhase={this.state.currentGamePhase} clickHandler={this.startQuitClickHandler}/>
      </div>
    )
  }
  
} 

export default App