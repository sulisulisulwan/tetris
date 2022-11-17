import * as React from 'react'

import PlayView from './visual-components/PlayView/PlayView'
import TitleView from './visual-components/TitleView/TitleView'
import {SinglePlayer, MultiPlayer, Options, HighScore, Help} from './visual-components/TitleView/menuOptions'
import { Engine } from './core/engine-phases/Engine'

import { appStateIF, initialOptionsIF, setAppStateIF, soundEffectsIF } from './interfaces'
import { makeCopy } from './core/utils/utils'

import { TestPlayfields } from '../__tests__/test-playfields/testPlayfields'
const newTestPlayfields = new TestPlayfields()


class App extends React.Component<{}, appStateIF> {

  readonly backgrounds: { [key: string]: string }
  private engine: Engine | null
  private playerKeystrokeHandler: React.KeyboardEventHandler
  public soundEffects: soundEffectsIF

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
      // playfield: this.getInitialPlayfield(),
      playfield: newTestPlayfields.backToBackTSpin,

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

      currentLevel: 1,

      patternItems: [],
      scoreItems: [],
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
      highScore: "coral",
      help: "gray",
      loadGame: "black"
    }

    this.startQuitClickHandler = this.startQuitClickHandler.bind(this)
    this.handlePlayerKeyStroke = this.handlePlayerKeyStroke.bind(this)    
    this.engine = null

  }

  setEngine() {
    const gameOptions = makeCopy(this.state.gameOptions)
    gameOptions.setAppState = this.setState.bind(this) as setAppStateIF
    this.engine = new Engine(gameOptions, this.soundEffects)
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
      this.setSoundEffects()
      this.setEngine()
      this.setState({ view: 'gameActive'})
    }

    if (this.state.view === 'gameActive') {

      this.engine.handleGameStateUpdate(this.state)
    }

  }

  setSoundEffects() {
    this.soundEffects = {
      one: document.getElementById('sound-effect-1') as HTMLAudioElement,
      levelUp: document.getElementById('sound-effect-2') as HTMLAudioElement,
      tetriminoMove: document.getElementById('sound-effect-3') as HTMLAudioElement,
      four: document.getElementById('sound-effect-4') as HTMLAudioElement,
      five: document.getElementById('sound-effect-5') as HTMLAudioElement,
      tetriminoLand: document.getElementById('sound-effect-6') as HTMLAudioElement,
      lineClear: document.getElementById('sound-effect-7') as HTMLAudioElement,
      eight: document.getElementById('sound-effect-8') as HTMLAudioElement,
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

  getView() {
    switch (this.state.view) {
      case 'gameActive':
        return (
          <PlayView 
            appState={this.state} 
            startQuitClickHandler={this.startQuitClickHandler} 
            playerKeystrokeHandler={this.playerKeystrokeHandler}
          />
        ) 
      case 'title':
        return (
          <TitleView 
            appState={this.state}
            setAppState={this.setState.bind(this)}  
          />
        )
      case 'singlePlayer':
        return (
          <SinglePlayer
            appState={this.state}
            setAppState={this.setState.bind(this)}  
          />
        )
      case 'multiPlayer':
        return (
          <MultiPlayer
            appState={this.state}
            setAppState={this.setState.bind(this)}  
          />
        )
      case 'options':
        return (
          <Options
            appState={this.state}
            setAppState={this.setState.bind(this)}  
          />
        )
      case 'highScore':
        return (
          <HighScore
            appState={this.state}
            setAppState={this.setState.bind(this)}  
          />
        )
      case 'loadGame':
        return (
          <div>LOADING</div>
        )
      case 'help':
        return (
          <Help
            appState={this.state}
            setAppState={this.setState.bind(this)}  
          />
        )
      // case '':
      //   break
    }
  }

  render() {
  
    this.setBackground(this.state.view)

    return (
      <div>
        { this.getView() }
        <audio id="sound-effect-1" src="./assets/sound/mixkit-arcade-mechanical-bling-210.wav"></audio>
        <audio id="sound-effect-2" src="./assets/sound/mixkit-game-bonus-reached-2065.wav"></audio>
        <audio id="sound-effect-3" src="./assets/sound/mixkit-player-jumping-in-a-video-game-2043.wav"></audio>
        <audio id="sound-effect-4" src="./assets/sound/mixkit-quick-positive-video-game-notification-interface-265.wav"></audio>
        <audio id="sound-effect-5" src="./assets/sound/mixkit-sci-fi-positive-notification-266.wav"></audio>
        <audio id="sound-effect-6" src="./assets/sound/mixkit-small-hit-in-a-game-2072.wav"></audio>
        <audio id="sound-effect-7" src="./assets/sound/mixkit-video-game-health-recharge-2837.wav"></audio>
        <audio id="sound-effect-8" src="./assets/sound/mixkit-winning-a-coin-video-game-2069.wav"></audio>
      </div>
    )
  }
} 

export default App