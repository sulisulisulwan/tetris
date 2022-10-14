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
      currentGamePhase: 'off',
      
      //Test state props
      intervalId: null,
      tetriminoMovementHandler: new TetriminoMovementHandler().setRotationSystem('super'),


      currentTetrimino: null
    }

    this.startQuitClickHandler = this.startQuitClickHandler.bind(this)
    this.generationPhase = this.generationPhase.bind(this)
    this.fallingPhase = this.fallingPhase.bind(this)
      this.setContinuousFallEvent = this.setContinuousFallEvent.bind(this)
      this.continuousFallEvent = this.continuousFallEvent.bind(this)
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


  generationPhase() {
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
          const tetrimino = Object.assign(Object.create(Object.getPrototypeOf(this.state.currentTetrimino)), this.state.currentTetrimino)
          
          const successfulMove = this.state.tetriminoMovementHandler.moveOneDown(playField, tetrimino)



          if (!successfulMove)  {
            clearInterval(this.intervalId)
            this.setState({
              intervalId: null,
              currentGamePhase: 'lock'
            })
            return
          }

          console.log(tetrimino)
          this.setState({
            currentTetrimino: tetrimino
          })
          
          //at the end of each fall event, a check is made if a one line for the tetrimino IN ITS CURRENT STATE is possible.  
          // If not, we clearInterval and setState for the next phase
        }


        playerKeystrokeHandler() {
          if (!this.state.currentGamePhase === 'falling') {
            return 
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
  }

  componentDidUpdate() {  
    const { currentGamePhase, gamePhases } = this.state
    const phaseHandler = gamePhases[currentGamePhase].bind(this)
    phaseHandler()
  }

  render() {
    return (
      <div>
        <div className="game-title">Tetris</div>
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