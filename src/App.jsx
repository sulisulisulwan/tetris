import React from 'react'
import PlayFieldGrid from './components/playfield/PlayFieldGrid.jsx'
import { NextQueue } from './random-generation/NextQueue.js'
import NextQueueDisplay from './NextQueueDisplay.jsx'
import StartQuitButton from './StartQuitButton.jsx'
import { offsetCoordsToLineBelow, gridCoordsAreClear } from './utils/utils.js'
import { Animate, Completion, Eliminate, Falling, Generation, Iterate, Lock, Pattern, Pregame } from './engine/index.js'
import { TetriminoMovementHandler } from './components/tetriminos/TetriminoMovementHandler.js'


class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      playField: this.getInitialPlayField(),
      nextQueue: new NextQueue(), // Danger with this one.  It holds state within the class, so we have to setState with this instantition for every update
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
        harddrop: false
      },
      currentGamePhase: 'off',
      
      //Test state props
      intervalId: null,
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
   * 
   * OFF PHASE
   * 
   */

  offPhase() {
    '>>> Game off'
  }
  /**
   * 
   * GENERATION PHASE
   * 
   */
  generationPhase() {

    // Dequeue a new tetrimino and instantiate it.
    const tetriminoCtr = this.state.nextQueue.dequeue()
    const newCurrentTetrimino = new tetriminoCtr()

    const playField = this.state.playField.slice()

    const startingOrientationCoords = newCurrentTetrimino.orientations[newCurrentTetrimino.currentOrientation].primaryPosition

    startingOrientationCoords.forEach(coord => {
      const [vertical, horizontal] = coord
      const [startingVertical, startingHorizontal] = newCurrentTetrimino.currentGridPosition
      playField[startingVertical + vertical][startingHorizontal + horizontal] = newCurrentTetrimino.minoGraphic
    })
    
    this.setState({ 
      playField,
      nextQueue: this.state.nextQueue,
      currentTetrimino: newCurrentTetrimino,
      currentGamePhase: 'falling'
    })
  }

  /**
   * 
   * FALLING PHASE
   * 
   */

  fallingPhase() {
    if (this.state.intervalId === null) {
      this.setState({ intervalId: this.setContinuousFallEvent() })
    }
    //set a setInterval event for updating termino downward motion?  Whenever you click downward it clearsthe interval?
  }

  setContinuousFallEvent() {
    return setInterval(this.continuousFallEvent.bind(this), 1000)
  }

  continuousFallEvent() {
    const playField = this.state.playField.slice()
    const tetrimino = this.state.currentTetrimino
    
    // Attempt to move the tetrimino down one line. If successful, its state will be altered
    const successfulMove = this.state.tetriminoMovementHandler.moveOneDown(playField, tetrimino)

    // With a successful change of internal data, force a rerender for visuals.
    if (successfulMove)  {
      this.setState({ currentTetrimino: tetrimino })
      return
    }

    // If unsuccessful we clearInterval and setState for locking down the termino.
    clearInterval(this.state.intervalId)
    this.setState({
      intervalId: null,
      currentGamePhase: 'lock'
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
            ['down','softdrop'],
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

          // left and right arrow actions
          if (playerAction === 'left' || playerAction === 'right') {
            const { autoRepeat } = this.state.playerAction
            let { right, left, override } = autoRepeat
            if (strokeType === 'keydown') {
              playerAction === 'left' ? left = true : right = true
              playerAction === 'left' ? override = 'left' : override = 'right'
            } else if(strokeType === 'keyup') {
              if (override === 'left') {
                override = right ? 'right' : null
              } else if (override === 'right') {
                override = left ? 'left' : null
              } else {
                override = null
              }
              playerAction === 'left' ? left = false : right = false
            }
            this.setState(prevState => ({
              playerAction: {
                ...prevState,
                autoRepeat: {
                  left,
                  right,
                  override
                }
              },
            }))
            return
          }

          // this may need additional logic banning auto repeat behavior
          if (playerAction === 'harddrop') {
            let harddrop = strokeType === 'keydown' ? true : false
            this.setState(prevState => ({
              playerAction: { 
                ...prevState.playerAction,
                harddrop 
              }
            }))
          }
          
          if (playerAction === 'softdrop') {
            let softdrop = strokeType === 'keydown' ? true : false
            this.setState(prevState => ({
              playerAction: { 
                ...prevState.playerAction,
                softdrop 
              }
            }))
          }

          // left = left, Num-4
          // right = right, Num-6
          // down = softdrop 
          // harddrop = spacebar, Num-8
          // rotate clockwise = Up, X, Num-1, Num-5, Num-9
          // rotate counter clockwise = Control, Z, Num-3, Num-7
          // hold = Shift, C, Num-0
          // pausegame = F1 or Esc

          // Auto repeat after 0.3 secs delay of holding down key
            // Moves tetrimino fully across playfield in 0.5 secs
            // Pressing opposite direction while holding original key will switch to that directino during auto repeat will re-initiate 0.3sec delay
            // Releasing one of the held keys will revert movement back to other direction after 0,3 sec delay

            // NO AUTO REPEAT FOR ROTATION
            // NO AUTO REPEAT FOR HARD DROP
            // Soft drop is 20 times faster than current drop time
              // This is an immediate auto repeat.  Only ceases when keystroke lifted
              // Lockdown does not occur till lock timer completed
              // Softdrop action should continue even after termino is locked and new termino generates while key is kept pressed
          // Here, write out the keyboard mapping logic
          // this handler will directly update terminos state AND the playfield grid.
        }
    
  /**
   * 
   * 
   * 
   */

    lockPhase() {

      //classic rules for lock: setTimeout for lock. 0.5 seconds unless player moves termino to a position which can fall
        // if so, revert to 'falling' phase
      // otherwise
        // termino is set to status of locked
        // TODO: for now we'll just loop back to generate
        // otherise continue to pattern phase
    }


  componentDidMount() {
    console.log(' >>>>> App component mounted')

    document.addEventListener('keydown', this.playerKeystrokeHandler, true)
    document.addEventListener('keyup', this.playerKeystrokeHandler, true)
  }

  componentDidUpdate() {  
    const { currentGamePhase, gamePhases } = this.state
    const phaseHandler = gamePhases[currentGamePhase].bind(this)
    console.log(this.state)
    phaseHandler()
  }

  render() {
    return (
      <div>
        <div className="game-title" onKeyDown={this.playerKeystrokeHandler}>Tetris</div>
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