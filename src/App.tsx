import * as React from 'react'

import PlayView from './visual-components/PlayView/PlayView'
import TitleView from './visual-components/TitleView/TitleView'
import {SinglePlayer, MultiPlayer, Options} from './visual-components/TitleView/menuOptions'
import { Engine } from './core/engine-phases/Engine'

import { appStateIF, initialOptionsIF, setAppStateIF } from './interfaces'
import { makeCopy } from './core/utils/utils'


class App extends React.Component<{}, appStateIF> {

  readonly backgrounds: { [key: string]: string }
  private engine: Engine | null
  private playerKeystrokeHandler: React.KeyboardEventHandler

  constructor(props: appStateIF) {
    super(props)
    this.state = {

      gameOptions: {
        possibleActivePatterns: {
          lineClear: true
        },
        rotationSystem: 'super',
        scoringSystem: 'classic',
        levelGoalsSystem: 'variable',
        lockMode: 'extended',
        setAppState: null
      },

      view: 'title',

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

    this.backgrounds = {
      gameActive: "https://img.freepik.com/free-photo/cool-geometric-triangular-figure-neon-laser-light-great-backgrounds_181624-11068.jpg?w=2000&t=st=1668228722~exp=1668229322~hmac=1e4c1bc515bd4d2d6c9146bb3d43b26bc08bc676904b90c0e8c9f24b026de6ea",
      title: "purple",
      singlePlayer: "green",
      multiPlayer: "blue",
      options: "yellow",
      loadGame: "black"
    }

    this.startQuitClickHandler = this.startQuitClickHandler.bind(this)
    this.handlePlayerKeyStroke = this.handlePlayerKeyStroke.bind(this)    
    this.engine = null

  }

  setEngine() {
    const gameOptions = makeCopy(this.state.gameOptions)
    gameOptions.setAppState = this.setState.bind(this) as setAppStateIF
    this.engine = new Engine(gameOptions)
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
    if (this.state.view === 'gameActive') {
      this.engine.playerControl.keystrokeHandler(this.state, e)
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handlePlayerKeyStroke, true)
    document.addEventListener('keyup', this.handlePlayerKeyStroke, true)
  }

  componentDidUpdate() { 

    if (this.state.view === 'loadGame') {
      this.setEngine()
      this.setState({ view: 'gameActive'})
    }

    if (this.state.view === 'gameActive') {

      this.engine.handleGameStateUpdate(this.state)
    }

  }

  setBackground(view: string): void {

    let background = this.backgrounds[view]

    if (background.substring(0,4) === 'http') {
      const urlPrefix = 'url('
      const urlSuffix = ')'
      background = urlPrefix + background + urlSuffix
    }
    const htmlTag = document.querySelector('html')
    htmlTag.style.background = background
  }

  render() {
  
    this.setBackground(this.state.view)

    if (this.state.view === 'title') {
      return (
        <TitleView 
          appState={this.state}
          setAppState={this.setState.bind(this)}  
        />
      )
    }

    if (this.state.view === 'singlePlayer') {
      console.log('this runs')
      return (
        <SinglePlayer
          appState={this.state}
          setAppState={this.setState.bind(this)}  
        />
      )
    }

    if (this.state.view === 'multiPlayer') {
      return (
        <MultiPlayer
          appState={this.state}
          setAppState={this.setState.bind(this)}  
        />
      )
    }

    if (this.state.view === 'options') {
      return (
        <Options
          appState={this.state}
          setAppState={this.setState.bind(this)}  
        />
      )
    }

    if (this.state.view === 'loadGame') {
      return (
        <div>LOADING</div>
      )
    }

    if (this.state.view === 'gameActive') {
      return (
        <PlayView 
          appState={this.state} 
          startQuitClickHandler={this.startQuitClickHandler} 
          playerKeystrokeHandler={this.playerKeystrokeHandler}
        />
      )
    }


  }
} 

export default App