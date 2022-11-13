import * as React from 'react'

import PlayView from './visual-components/PlayView/PlayView'


import { Engine } from './core/engine-phases/Engine'

import { appStateIF, initialOptionsIF, setAppStateIF } from './interfaces'

const initialOptions: initialOptionsIF = {
  possibleActivePatterns: {
    lineClear: true
  },
  rotationSystem: 'super',
  scoringSystem: 'classic',
  levelGoalsSystem: 'variable',
  lockMode: 'extended',
  setAppState: null
}

class App extends React.Component<{}, appStateIF> {

  readonly engine: Engine
  private playerKeystrokeHandler: React.KeyboardEventHandler

  constructor(props: appStateIF) {
    super(props)
    this.state = {

      view: 'titleScreen',

      currentTetrimino: null,
      playfield: this.getInitialPlayfield(),

      gameMode: 'classic',
      nextQueue: null,
      holdQueue: {
        swapStatus: 'swapAvailableNow',
        heldTetrimino: null
      },

      currentGamePhase: 'off',

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
      rightIntervalId: null,
      leftIntervalId: null,
      
      autoRepeatDelayTimeoutId: null,
      fallIntervalId: null,

      pregameCounter: 1, // This should be 2
      pregameIntervalId: null,

      lockTimeoutId: null,
      extendedLockdownMovesRemaining: 15,
      lowestLockSurfaceRow: null,
      postLockMode: false,

      eliminationActions: [],

      currentLevel: 1,
      scoringItemsForCompletion: [],
      levelClearedLinesGoal: 5, // this is a fixed goal system
      fallSpeed: 1000,
      totalLinesCleared: 0,
      totalScore: 0,
      performedTSpin: false,
      performedTSpinMini: false,
      backToBack: false,
      
      scoringHistoryPerCycle: {},

      ghostTetriminoOn: false,
      ghostCoords: []
    }

    this.startQuitClickHandler = this.startQuitClickHandler.bind(this)
    this.handlePlayerKeyStroke = this.handlePlayerKeyStroke.bind(this)    
    this.engine = this.setEngine()

  }

  setEngine() {
    initialOptions.setAppState = this.setState.bind(this) as setAppStateIF
    return new Engine(initialOptions)
  }

  getInitialPlayfield() {
    const initialPlayfield = new Array(40).fill(null)
    return initialPlayfield.map(row => new Array(10).fill('[_]', 0, 10))
  }

  startQuitClickHandler(e: Event): void {
    e.preventDefault()
    // may in the future implement "countdown" gamePhase
    this.state.currentGamePhase === 'off' ?
      this.setState({ currentGamePhase: 'pregame', }) : this.setState({ currentGamePhase: 'off' })
  } 

  handlePlayerKeyStroke(e: KeyboardEvent) {
    e.preventDefault()
    this.engine.playerControl.keystrokeHandler(this.state, e)
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handlePlayerKeyStroke, true)
    document.addEventListener('keyup', this.handlePlayerKeyStroke, true)
  }

  componentDidUpdate() { 
    this.engine.handleGameStateUpdate(this.state)
  }

  render() {
  
    // if (this.state.view === 'play') {
      return (
        <PlayView 
          appState={this.state} 
          startQuitClickHandler={this.startQuitClickHandler} 
          playerKeystrokeHandler={this.playerKeystrokeHandler}
        />
      )
    // }

  }
} 

export default App