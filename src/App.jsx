import React from 'react'
import PlayFieldGrid from './components/playfield/PlayFieldGrid.jsx'
import { NextQueue } from './next-queue/NextQueue.js'
import NextQueueDisplay from './NextQueueDisplay.jsx'
import StartQuitButton from './StartQuitButton.jsx'
import { offsetCoordsToLineBelow, gridCoordsAreClear } from './utils/utils.js'
import { Animate, Completion, Eliminate, Falling, Generation, Iterate, Lock, Pattern, Pregame } from './engine/index.js'
import { TetriminoMovementHandler } from './components/tetriminos/TetriminoMovementHandler.js'
import { PlayerControl } from './playerControl/PlayerControl.js'

import { TetriminoFactory } from './components/tetriminos/TetriminoFactory'
import { makeCopy } from './utils/utils.js'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      playField: this.getInitialPlayField(),
      nextQueue: new NextQueue(), // Danger with this one.  It holds state within the class, so we have to setState with this instantition for every update
      tetriminoMovementHandler: new TetriminoMovementHandler(),
      playerControlHandler: new PlayerControl(),
      holdQueue: {
        swapStatus: 'swapAvailableNow',
        heldTetrimino: null
      },
      gamePhases: {
        off: this.offPhase,
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
      fallSpeed: 250,
      fallIntervalId: null,
      currentTetrimino: null
    }


    this.startQuitClickHandler = this.startQuitClickHandler.bind(this)
    
    this.offPhase = this.offPhase.bind(this)
    this.generationPhase = this.generationPhase.bind(this)
    this.fallingPhase = this.fallingPhase.bind(this)
      this.setContinuousFallEvent = this.setContinuousFallEvent.bind(this)
      this.continuousFallEvent = this.continuousFallEvent.bind(this)
      // this.playerKeystrokeHandler = this.playerKeystrokeHandler.bind(this)
      this.handlePlayerKeyStroke = this.handlePlayerKeyStroke.bind(this)
    this.lockPhase = this.lockPhase.bind(this)
      this.lockDownTimeout = this.lockDownTimeout.bind(this)
    this.patternPhase = this.patternPhase.bind(this)
    this.iteratePhase = this.iteratePhase.bind(this)
    this.animatePhase = this.animatePhase.bind(this)
    this.eliminatePhase = this.eliminatePhase.bind(this)
    this.completionPhase = this.completionPhase.bind(this)
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
    this.state.playerControlHandler.keystrokeHandler(e, this.setState.bind(this), this.state)
  }

  /**
   * OFF PHASE
   */

  offPhase() {
    // console.log('>>> Game off')
  }

  /**
   * GENERATION PHASE
   */
  generationPhase() {

    // Dequeue a new tetrimino and instantiate it.
    const tetriminoContext = this.state.nextQueue.dequeue()
    const newTetrimino = TetriminoFactory.getTetrimino(tetriminoContext)
    
    const playField = makeCopy(this.state.playField)

    const startingOrientationCoords = newTetrimino.orientations[newTetrimino.currentOrientation].coordsOffOrigin

    startingOrientationCoords.forEach(coord => {
      const [vertical, horizontal] = coord
      const [startingVertical, startingHorizontal] = newTetrimino.currentOriginOnPlayfield
      playField[startingVertical + vertical][startingHorizontal + horizontal] = newTetrimino.minoGraphic
    })

    let { swapStatus } = this.state.holdQueue
    if (swapStatus === 'justSwapped') {
      swapStatus = 'swapAvailableNextTetrimino'
    } else if (swapStatus === 'swapAvailableNextTetrimino') {
      swapStatus = 'swapAvailableNow'
    }
    
    this.setState(prevState => ({ 
      playField,
      nextQueue: this.state.nextQueue,
      currentTetrimino: newTetrimino,
      currentGamePhase: 'falling',
      holdQueue: {
        ...prevState.holdQueue,
        swapStatus
      }
    }))
  }

  /**
   * 
   * FALLING PHASE
   * 
   */

  fallingPhase() {
    // console.log('>>>>>>>>> FALLING PHASE')
    if (this.state.fallIntervalId === null) {
      this.setState({ fallIntervalId: this.setContinuousFallEvent() })
    }
    //set a setInterval event for updating termino downward motion?  Whenever you click downward it clearsthe interval?
  }

  setContinuousFallEvent() {
    return setInterval(this.continuousFallEvent.bind(this), this.state.fallSpeed)
  }

  continuousFallEvent() {
    const playFieldCopy = makeCopy(this.state.playField)
    const tetriminoCopy = makeCopy(this.state.currentTetrimino)

    // Attempt to move the tetrimino down one line. If successful, its state will be altered
    const { newPlayField, newTetrimino, successfulMove} = this.state.tetriminoMovementHandler.moveOne('down', playFieldCopy, tetriminoCopy)

    // With a successful change of internal data, force a rerender for visuals.
    if (successfulMove)  {
      this.setState({ 
        currentTetrimino: newTetrimino,
        playField: newPlayField 
      })
      return
    }
    
    // If unsuccessful we clearInterval and setState for locking down the termino.
    clearInterval(this.state.fallIntervalId)
    this.setState({
      fallIntervalId: null,
      currentGamePhase: 'lock',
      lockIntervalId: setTimeout(this.lockDownTimeout,500)
    })
  }

  lockPhase() {

    // console.log('>>>>>>> LOCK PHASE')

    // Player can still alter the the tetrimino's position and orientation.
    // Everytime player alters tetrimino position and orientation, lockPhase runs and checks if
    //classic rules for lock: setTimeout for lock. 0.5 seconds unless player moves termino to a position which can fall

    //TODO:note: using the Super Rotation System, rotating a tetrimino often causes the y-coordinate of the tetrimino to increase, 
    //i.e., it “lifts up” off the Surface it landed on. the Lock down timer does not reset in this case, but it does stop 
    //counting down until the tetrimino lands again on a Surface that has the same (or higher) y-coordinate as it did before 
    //it was rotated. only if it lands on a Surface with a lower y-coordinate will the timer reset.

    const playField = this.state.playField.slice()
    const tetrimino = this.state.currentTetrimino
    
    const positionOfLineBelow = offsetCoordsToLineBelow(tetrimino.currentOriginOnPlayfield)
    if (gridCoordsAreClear(positionOfLineBelow, playField)) {
      this.clearTimeout(this.lockIntervalId)
      this.setState({
        currentGamePhase: 'falling',
        lockIntervalId: null
      })
    }
    
    // Otherwise, the timer runs out and we continue to pattern phase
  }

  lockDownTimeout() {

    clearTimeout(this.lockIntervalId)
    const tetriminoCopy = makeCopy(this.state.currentTetrimino)
    tetriminoCopy.status = 'locked'

    this.setState({
      currentGamePhase: 'pattern',
      lockIntervalId: null,
      currentTetrimino: tetriminoCopy
    })
    // this.setState({
    //   currentGamePhase: 'pattern',
    //   lockIntervalId: null,
    //   currentTetrimino: tetriminoCopy
    // })
  }

  patternPhase() {
    // console.log('>>>> PATTERN PHASE')
    // In this phase, the engine looks for patterns made from Locked down Blocks in the Matrix. 
    // once a pattern has been matched, it can trigger any number of tetris variant-related effects.
    // the classic pattern is the Line Clear pattern. this pattern is matched when one or more rows 
    // of 10 horizontally aligned Matrix cells are occupied by Blocks. the matching Blocks are then 
    // marked for removal on a hit list. Blocks on the hit list are cleared from the Matrix at a later 
    // time in the eliminate Phase.

    this.setState({
      currentGamePhase: 'iterate'
    })
  }

  iteratePhase() {
    // console.log('>>>>>>>ITERATE PHASE')

    // In this phase, the engine is given a chance to scan through all cells in 
    // the Matrix and evaluate or manipulate them according to an editor-defined 
    // iteration script. this phase consumes no apparent game time. note: this
    // phase is included in the engine to allow for more complicated variants in 
    // the future, and has thus far not been used.

    this.setState({
      currentGamePhase: 'animate'
    })
  }
  
  animatePhase() {
    // console.log('>>>>>>>ANIMATE PHASE')

    // Here, any animation scripts are executed within the Matrix. the tetris engine 
    // moves on to the eliminate Phase once all animation scripts have been run.

    this.setState({
      currentGamePhase: 'eliminate'
    })
  }
  
  eliminatePhase() {
    // console.log('>>>>>>>ELIMINATE PHASE')

    // Any Minos marked for removal, i.e., on the hit list, are cleared from the 
    // Matrix in this phase. If this results in one or more complete 10-cell rows
    // in the Matrix becoming unoccupied by Minos, then all Minos above that row(s) 
    // collapse, or fall by the number of complete rows cleared from the Matrix. 
    // Points are awarded to the player according to the tetris Scoring System, as
    // seen in the scoring section.  game statistics  such as the number of Singles, 
    // doubles, triples, tetrises, and t-Spins can also be tracked in the eliminate 
    // Phase. Ideally, some sort of High Score table should record the player’s name, 
    // the highest level reached, his total score, and other statistics that can be 
    // tracked in this phase.

    this.setState({
      currentGamePhase: 'completion'
    })
  }

  completionPhase() {
    // console.log('>>>>>>>COMPLETION PHASE')

    // this is where any updates to information fields on the tetris playfield are updated, 
    // such as the Score and time. the Level up condition is also checked to see if it is 
    // necessary to advance the game level.

    this.setState({
      currentGamePhase: 'generation'
    })
  }

  componentDidMount() {
    // console.log(' >>>>> App component mounted')

    document.addEventListener('keydown', this.handlePlayerKeyStroke, true)
    document.addEventListener('keyup', this.handlePlayerKeyStroke, true)
  }

  componentDidUpdate() {  
    const { currentGamePhase, gamePhases } = this.state
    const phaseHandler = gamePhases[currentGamePhase].bind(this)
    phaseHandler()
  }

  render() {
    return (
      <div>
        <div className="game-title" onKeyDown={this.playerKeystrokeHandler}>Tetris</div>
        <div className="playfield-and-nextqueue">
          {/* <PlayFieldGrid playFieldData={this.state.playField}/> */}
          <PlayFieldGrid playFieldData={this.state.playField.slice(20)}/>
          <NextQueueDisplay nextqueueData={this.state.nextQueue}/>
        </div>
        <StartQuitButton currentGamePhase={this.state.currentGamePhase} clickHandler={this.startQuitClickHandler}/>
      </div>
    )
  }
  
} 

export default App