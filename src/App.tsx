import * as React from 'react'
import { Engine } from './core/engine-phases/Engine'

import { appStateIF, setAppStateIF, soundEffectsIF } from './interfaces'
import { makeCopy } from './core/utils/utils'

import { TestPlayfields } from '../__tests__/test-playfields/testPlayfields'
import { getView } from './getView'
import { soundEffectsConfig, soundEffectsConfigIF } from './soundEffectsToSet'
import { getBackgrounds } from './getBackgrounds'

const newTestPlayfields = new TestPlayfields()


class App extends React.Component<{}, appStateIF> {

  readonly backgrounds: { [key: string]: string }
  private engine: Engine | null
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
      playfield: this.getInitialPlayfield(),
      // playfield: newTestPlayfields.backToBackTSpin,

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

    this.backgrounds = getBackgrounds()

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

    const soundEffectsToSet = {} as soundEffectsIF

    for (const sound in soundEffectsConfig) {
      soundEffectsToSet[sound as keyof soundEffectsIF] = document.getElementById(sound) as HTMLAudioElement
    }

    this.soundEffects = soundEffectsToSet
  }
  
  addSoundEffectsToHTML() {

    const audioTags = [] 

    for (const sound in soundEffectsConfig) {
      audioTags.push(<audio id={sound} src={soundEffectsConfig[sound]}></audio>)
    }

    return audioTags
  }

  setBackground(view: string): void {

    let backgroundUrl = this.backgrounds[view]

    if (backgroundUrl.substring(0,4) === 'http') {
      backgroundUrl = `url(${backgroundUrl})`
    }
    const htmlTag = document.querySelector('html')
    htmlTag.style.background = backgroundUrl
    htmlTag.style.backgroundPosition = 'center'
  }

  getView() {
    const getter = getView.bind(this)
    return getter()
  }

  renderSoundEffects() {
    const { soundEffects } = this

  }

  render() {
  
    this.setBackground(this.state.view)

    return (
      <div>
        { this.getView() }
        { this.addSoundEffectsToHTML().map(audioTag => audioTag ) }
      </div>
    )
  }
} 



export default App