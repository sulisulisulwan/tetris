import React from 'react'
import PlayFieldGrid from './visual-components/playfield/PlayFieldGrid.jsx'
import NextQueueDisplay from './visual-components/next-queue/NextQueueDisplay.jsx'
import StartQuitButton from './visual-components/StartQuitButton.jsx'
import ScoreDisplay from './visual-components/ScoreDisplay.jsx'

import { PlayerControl } from './core/player-control/PlayerControl.js'
import { Engine } from './core/engine-phases/Engine.js'

const initialOptions = {
  possibleActivePatterns: {
    lineClear: true
  },
  rotationSystem: 'super',
  scoringSystem: 'classic',
  levelGoalsSystem: 'fixed'
}

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      playField: this.getInitialPlayField(),
      gameMode: 'classic',
      nextQueueData: null,
      holdQueue: {
        swapStatus: 'swapAvailableNow',
        heldTetrimino: null
      },

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
      lockIntervalId: null,
      currentTetrimino: null,

      scoringContextsForCompletion: [],

      currentLevel: 1,
      levelClearedLinesGoal: 5, // this is a fixed goal system
      fallSpeed: 1000,
      totalLinesCleared: 0,

      backToBack: false,
      performedTSpin: false,
      performedMiniTSpin: false
    }

    this.startQuitClickHandler = this.startQuitClickHandler.bind(this)
    this.handlePlayerKeyStroke = this.handlePlayerKeyStroke.bind(this)    
    this.engine = this.setEngine()

  }

  setEngine() {
    return new Engine(initialOptions)
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
    e.preventDefault()
    this.engine.playerControl.keystrokeHandler(e, this.setState.bind(this), this.state)
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handlePlayerKeyStroke, true)
    document.addEventListener('keyup', this.handlePlayerKeyStroke, true)
  }

  componentDidUpdate() { 
    this.engine.handleGameStateUpdate(this.state, this.setState.bind(this))
  }

  render() {
    return (
      <div className="game-app-wrapper">
        <div className="game-title" onKeyDown={this.playerKeystrokeHandler}>Suli's Tetris</div>
        <div className="playfield-and-sidebar-right">
          <PlayFieldGrid 
            playFieldData={this.state.playField.slice(20)}
            currentLevel={this.state.currentLevel}  
          />
          <div className='sidebar-right'>
            <ScoreDisplay 
              scoreData={this.state.totalScore} 
              currentLevel={this.state.currentLevel} 
              linesCleared={this.state.totalLinesCleared}
              />
            <NextQueueDisplay 
              nextQueueData={this.state.nextQueueData}
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