import React from 'react'
import PlayFieldGrid from './components/playfield/PlayFieldGrid.jsx'
import NextQueueDisplay from './NextQueueDisplay.jsx'
import StartQuitButton from './StartQuitButton.jsx'
import { PlayerControl } from './playerControl/PlayerControl.js'
import { Engine } from './engine-phases/Engine.js'

const playerControlHandler = new PlayerControl()

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      playField: this.getInitialPlayField(),
      nextQueueData: null,
      holdQueue: {
        swapStatus: 'swapAvailableNow',
        heldTetrimino: null
      },
      playerAction: {
        autoRepeat: {
          left: false,
          right: false,
          override: null,
        },
        softdrop: false,
        harddrop: false,
        flipClockwise: false,
        flipCounterClockwise: false,
        hold: false
      },
      currentGamePhase: 'off',

      possibleActivePatterns: {
        lineClear: true
      },

      eliminationActions: [],

      fallSpeed: 250,
      fallIntervalId: null,
      lockIntervalId: null,
      currentTetrimino: null
    }

    this.startQuitClickHandler = this.startQuitClickHandler.bind(this)
    this.handlePlayerKeyStroke = this.handlePlayerKeyStroke.bind(this)
    
    this.engine = this.setEngine()

  }

  setEngine() {
    return new Engine(this.state)
  }

  getInitialPlayField() {
    const initialPlayField = new Array(40).fill(null)
    return initialPlayField.map(row => new Array(10).fill('[_]', 0, 10))
  }

  startQuitClickHandler(e) {
    e.preventDefault()
    // may in the future implement "countdown" gamePhase
    this.state.currentGamePhase === 'off' ?
      this.setState({ currentGamePhase: 'generation', }) : this.setState({ currentGamePhase: 'off' })
  }

  handlePlayerKeyStroke(e) {
    if (e.type === 'keyup') {
      // console.log('in ABSOLUTE highest level handler on keyup', this.state)

    }
    playerControlHandler.keystrokeHandler(e, this.setState.bind(this), this.state)
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handlePlayerKeyStroke, true)
    document.addEventListener('keyup', this.handlePlayerKeyStroke, true)
  }

  componentDidUpdate() { 
    if (this.state.playField.every(row => row.every(square => square === '[_]'))) {
      // console.log('EMPTY')
    }
    this.engine.handleGameStateUpdate(this.state, this.setState.bind(this))
  }

  render() {
    return (
      <div>
        <div className="game-title" onKeyDown={this.playerKeystrokeHandler}>Suli's Tetris</div>
        <div className="playfield-and-nextqueue">
          <PlayFieldGrid playFieldData={this.state.playField.slice(20)}/>
          <NextQueueDisplay nextQueueData={this.state.nextQueueData}/>
        </div>
        <StartQuitButton currentGamePhase={this.state.currentGamePhase} clickHandler={this.startQuitClickHandler}/>
      </div>
    )
  }
  
} 

export default App