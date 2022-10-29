import React from 'react'
import { TestPlayfields } from '../__tests__/test-playfields/testPlayfields.js'

import PlayfieldGrid from './visual-components/playfield/PlayfieldGrid.jsx'
import NextQueueDisplay from './visual-components/next-queue/NextQueueDisplay.jsx'
import StartQuitButton from './visual-components/StartQuitButton.jsx'
import ScoreDisplay from './visual-components/ScoreDisplay.jsx'

import { Engine } from './core/engine-phases/Engine.js'
import HoldQueueDisplay from './visual-components/hold-queue/HoldQueueDisplay.jsx'

const initialOptions = {
  possibleActivePatterns: {
    lineClear: true
  },
  rotationSystem: 'super',
  scoringSystem: 'classic',
  levelGoalsSystem: 'fixed'
}


const testPlayfields = new TestPlayfields()

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      playfield: this.getInitialPlayfield(),
      gameMode: 'classic',
      nextQueue: null,
      holdQueue: {
        swapStatus: 'swapAvailableNow',
        heldTetrimino: null
      },

      pregameCounter: 1, // This should be 2
      pregameIntervalId: null,

      totalScore: 0,
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

      eliminationActions: [],

      fallIntervalId: null,
      lockTimeoutId: null,
      currentTetrimino: null,

      scoringContextsForCompletion: [],

      currentLevel: 1,
      levelClearedLinesGoal: 5, // this is a fixed goal system
      fallSpeed: 1000,
      totalLinesCleared: 0,

      performedTSpin: false,
      performedTSpinMini: false,
      backToBack: false,
      lowestLockSurfaceRow: null,

      scoringHistoryPerCycle: {}
    }

    this.startQuitClickHandler = this.startQuitClickHandler.bind(this)
    this.handlePlayerKeyStroke = this.handlePlayerKeyStroke.bind(this)    
    this.engine = this.setEngine()

  }

  setEngine() {
    initialOptions.setAppState = this.setState.bind(this)
    return new Engine(initialOptions)
  }

  getInitialPlayfield() {
    const initialPlayfield = new Array(40).fill(null)
    return initialPlayfield.map(row => new Array(10).fill('[_]', 0, 10))
  }

  startQuitClickHandler(e) {
    e.preventDefault()
    // may in the future implement "countdown" gamePhase
    this.state.currentGamePhase === 'off' ?
      this.setState({ currentGamePhase: 'pregame', }) : this.setState({ currentGamePhase: 'off' })
  }

  handlePlayerKeyStroke(e) {
    e.preventDefault()
    this.engine.playerControl.keystrokeHandler(this.state, e)
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handlePlayerKeyStroke, true)
    document.addEventListener('keyup', this.handlePlayerKeyStroke, true)
  }

  componentDidUpdate() { 
    console.log('fallspeed: >>>>>>', this.state.fallSpeed)
    this.engine.handleGameStateUpdate(this.state, this.setState.bind(this))
  }

  render() {
    return (
      <div className="game-app-wrapper">
        <div className="game-title" onKeyDown={this.playerKeystrokeHandler}>Suli's Tetris</div>
        {this.state.currentGamePhase === 'pregame' ? <div style={{textAlign: 'center'}}>{this.state.pregameCounter + 1}</div> : <div style={{textAlign: 'center'}}> --- </div>}
        <div className="playfield-and-sidebar-right">
          <HoldQueueDisplay 
            holdQueue={this.state.holdQueue} 
            currentLevel={this.state.currentLevel}
          />
          <PlayfieldGrid 
            playfieldData={this.state.playfield.slice(20)}
            currentLevel={this.state.currentLevel}  
          />
          <div className='sidebar-right'>
            <ScoreDisplay 
              scoreData={this.state.totalScore} 
              currentLevel={this.state.currentLevel} 
              linesCleared={this.state.totalLinesCleared}
              />
            <NextQueueDisplay 
              nextQueueData={this.state.nextQueue}
              currentLevel={this.state.currentLevel} 
            />
          </div>
        </div>
        <StartQuitButton currentGamePhase={this.state.currentGamePhase} clickHandler={this.startQuitClickHandler}/>
        <div className="instructions">
          <div className="instruction-block">Use arrows for left and right</div>
          <div className="instruction-block">flip left = z</div>
          <div className="instruction-block">flip right = x</div>
          <div className="instruction-block">hard drop = space</div>
          <div className="instruction-block">soft drop = down arrow</div>
        </div>
        

      </div>
    )
  }
  
} 

export default App