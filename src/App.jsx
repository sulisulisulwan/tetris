import React from 'react'
import PlayFieldGrid from './components/playfield/PlayFieldGrid.jsx'
import { NextQueue } from './next-queue/NextQueue.js'
import NextQueueDisplay from './NextQueueDisplay.jsx'
import StartQuitButton from './StartQuitButton.jsx'
import { offsetCoordsToLineBelow, gridCoordsAreClear } from './utils/utils.js'
import { Animate, Completion, Eliminate, Falling, Generation, Iterate, Lock, Pattern, Pregame } from './engine/index.js'
import { TetriminoMovementHandler } from './components/tetriminos/TetriminoMovementHandler.js'

import { TetriminoFactory } from './components/tetriminos/TetriminoFactory'
import { makeCopy } from './utils/utils.js'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      playField: this.getInitialPlayField(),
      nextQueue: new NextQueue(), // Danger with this one.  It holds state within the class, so we have to setState with this instantition for every update
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
        clockwise: false,
        counterClockwise: false,
        hold: false
      },
      
      currentGamePhase: 'off',
      fallSpeed: 1000,
      //Test state props
      fallIntervalId: null,
      tetriminoMovementHandler: new TetriminoMovementHandler().setRotationSystem('super'),


      currentTetrimino: null
    }


    this.startQuitClickHandler = this.startQuitClickHandler.bind(this)
    
    this.offPhase = this.offPhase.bind(this)
    this.generationPhase = this.generationPhase.bind(this)
    this.fallingPhase = this.fallingPhase.bind(this)
      this.setContinuousFallEvent = this.setContinuousFallEvent.bind(this)
      this.continuousFallEvent = this.continuousFallEvent.bind(this)
      this.playerKeystrokeHandler = this.playerKeystrokeHandler.bind(this)
      this.playerKeystrokeHandler = this.playerKeystrokeHandler.bind(this)
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

    const startingOrientationCoords = newTetrimino.orientations[newTetrimino.currentOrientation].primaryPosition

    startingOrientationCoords.forEach(coord => {
      const [vertical, horizontal] = coord
      const [startingVertical, startingHorizontal] = newTetrimino.currentGridPosition
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


        playerKeystrokeHandler(e) {

          if (!this.state.currentGamePhase === 'falling') {
            return 
          }

          e.preventDefault()

          const key = e.key
          const strokeType = e.type

          const keystrokeMap = new Map([
            ['ArrowLeft','left'],
            ['num4','left'],
            ['ArrowRight','right'],
            ['num6','right'],
            ['ArrowDown','softdrop'],
            [' ','harddrop'],
            ['num8','harddrop'],
            ['ArrowUp','clockwise'],
            ['x','clockwise'],
            ['num1','clockwise'],
            ['num5','clockwise'],
            ['num9','clockwise'],
            ['Control','counter-clockwise'],
            ['z','counter-clockwise'],
            ['num3','counter-clockwise'],
            ['num7','counter-clockwise'],
            ['Shift','hold'],
            ['c','hold'],
            ['num0','hold'],
            ['F1','pausegame'],
            ['Escape','pausegame'],
          ])

          const playerAction = keystrokeMap.get(key)

          const playField = makeCopy(this.state.playField)
          const tetrimino = makeCopy(this.state.currentTetrimino)

          

          /*************
           * 
           * AUTO REPEAT ACTIONS
           * 
           ************/

          // Left and Right arrow actions
          if (playerAction === 'left' || playerAction === 'right') {
            // ArrowLeft = left, Num-4
            // ArrowRight = right, Num-6
            // Auto repeat after 0.3 secs delay of holding down key
            // Moves tetrimino fully across playfield in 0.5 secs
            // Pressing opposite direction while holding original key will switch to that directino during auto repeat will re-initiate 0.3sec delay
            // Releasing one of the held keys will revert movement back to other direction after 0,3 sec delay
            const { autoRepeat } = this.state.playerAction
            let { right, left, override } = autoRepeat

            // Determine what action will be taken.  Override always determines this.
            if (strokeType === 'keydown') {
              playerAction === 'left' ? left = true : right = true
              playerAction === 'left' ? override = 'left' : override = 'right'
            } else if (strokeType === 'keyup') {
              if (playerAction === 'left') {
                left = false
                override = right ? 'right' : null
              } else if (playerAction === 'right') {
                right = false
                override = left ? 'left' : null
              }
            }

            // Validate and apply the override action
            if (override === 'left') {
              let { newPlayField, newTetrimino } = this.state.tetriminoMovementHandler.moveOne('left', playField, tetrimino)
              this.setState(prevState => {
                return ({
                  ...prevState,
                  playerAction: {
                    ...prevState.playerAction,
                    autoRepeat: {
                      left,
                      right,
                      override
                    }
                  },
                  playField: newPlayField,
                  currentTetrimino: newTetrimino
              })})

            } else if (override === 'right') {
              let { newPlayField, newTetrimino } = this.state.tetriminoMovementHandler.moveOne('right', playField, tetrimino)

              this.setState(prevState => {
                return ({
                  ...prevState,
                  playerAction: {
                    ...prevState.playerAction,
                    autoRepeat: {
                      left,
                      right,
                      override
                    }
                  },
                  playField: newPlayField,
                  currentTetrimino: newTetrimino
              })})
            } else if (override === null) {
              this.setState(prevState => {
                return ({
                  ...prevState,
                  playerAction: {
                    ...prevState.playerAction,
                    autoRepeat: {
                      left,
                      right,
                      override
                    }
                  },
              })})
            }
            return
          }
          
          if (playerAction === 'softdrop') {
              // ArrowDown = softdrop 
              // Soft drop is 20 times faster than current drop time
              // This is an immediate auto repeat.  Only ceases when keystroke lifted
              // Lockdown does not occur till lock timer completed
              // Softdrop action should continue even after termino is 
              //locked and new termino generates while key is kept pressed
            let softdrop = strokeType === 'keydown' ? true : false
            this.setState(prevState => ({
              playerAction: { 
                ...prevState.playerAction,
                softdrop 
              }
            }))
          }

          /* *********
           * 
           *  NON AUTO REPEAT ACTIONS
           * 
           * **********/
          if (
            playerAction === 'harddrop' || 
            playerAction === 'clockwise' || 
            playerAction === 'counter-clockwise'
          ) {
          // harddrop = spacebar, Num-8
          // rotate clockwise = Up, X, Num-1, Num-5, Num-9
          // rotate counter clockwise = Control, Z, Num-3, Num-7

            if (strokeType === 'keydown' && this.state.playerAction[playerAction]) {
              return
            }

            this.setState(prevState => ({
              playerAction: { 
                ...prevState.playerAction,
                [playerAction]: strokeType === 'keyup' ? false : true
              }
            }))

          }

          if (playerAction === 'hold') {
            if (strokeType === 'keydown' && this.state.playerAction[hold]) {
              return
            }

            let { swapStatus } = this.state.holdQueue
            if (swapStatus === 'swapAvailableNow') {

              let { heldTetrimino } = this.state.holdQueue
              const { currentTetrimino } = this.state

              currentTetrimino.reset()
              const newHoldQueueTetrimino = currentTetrimino

              swapStatus = 'justSwapped'

              // In the case where hold is used for the first time in game,
              // the current held tetrimino will be null and swapped for the
              // current tetrimino, which should, in essence return the game state
              // to the first drop of the game, except with a filled hold queue
              this.setState(prevState => ({
                ...prevState,
                currentGamePhase: 'generation',
                playerAction: { 
                  ...prevState.playerAction,
                  hold: strokeType === 'keyup' ? false : true
                },
                holdQueue: {
                  swapStatus,
                  heldTetrimino: newHoldQueueTetrimino
                },
                currentTetrimino: heldTetrimino
              }))

              return
            }

            this.setState(prevState => ({
              ...prevState,
              playerAction: { 
                ...prevState.playerAction,
                hold: strokeType === 'keyup' ? false : true
              },
            }))
          }

          // hold = Shift, C, Num-0
          // pausegame = F1 or Esc

            // NO AUTO REPEAT FOR ROTATION
            // NO AUTO REPEAT FOR HARD DROP

          // Here, write out the keyboard mapping logic
          // this handler will directly update terminos state AND the playfield grid.
        }
    
  /**
   * 
   * 
   * 
   */

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
    
    const positionOfLineBelow = offsetCoordsToLineBelow(tetrimino.currentGridPosition)
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
      currentGamePhase: 'off',
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

    document.addEventListener('keydown', this.playerKeystrokeHandler, true)
    document.addEventListener('keyup', this.playerKeystrokeHandler, true)
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