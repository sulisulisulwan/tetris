import BasePhase from "./BasePhase.js";
import { makeCopy } from "../../utils/utils.js";
import { TetriminoMovementHandler } from "../../components/tetriminos/TetriminoMovementHandler.js";

export default class Falling extends BasePhase {

  constructor() {
    super()
    this.tetriminoMovementHandler = new TetriminoMovementHandler()
    this.acquiredState = null
  }

  execute(stateData, setState) {

    // console.log('>>> FALLING PHASE')
    // /* 
    //   If phase has already been in motion and player soft drop is in motion,
    // */
    // if (stateData.playerAction.softDrop === true) {

    //   // If softDrop has just been commanded, clear the intervallic falling event.
    //   if (stateData.fallIntervalId) {
    //     // clear interval and set fallIntervalId to null
    //   }
    //   return
    // } 
    this.setAcquiredState(stateData)

    // If phase just begun, kick off intervallic falling event
    if (stateData.fallIntervalId === null) {
      setState({ fallIntervalId: this.setContinuousFallEvent(stateData, setState) })
    }
    
    //set a setInterval event for updating termino downward motion?  Whenever you click downward it clearsthe interval?
  }

  setContinuousFallEvent(stateData, setState) {
    // TODO: THE problem is that we're locking in the value of stateData with this callback
    return setInterval(this.continuousFallEvent.bind(this), stateData.fallSpeed, setState)
  }

  continuousFallEvent(setState) {
    const playFieldCopy = makeCopy(this.acquiredState.playField)
    const tetriminoCopy = makeCopy(this.acquiredState.currentTetrimino)

    // Attempt to move the tetrimino down one line. If successful, its state will be altered
    const { newPlayField, newTetrimino, successfulMove} = this.tetriminoMovementHandler.moveOne('down', playFieldCopy, tetriminoCopy)

    // With a successful change of internal data, force a rerender for visuals.
    if (successfulMove)  {
      
      setState(prevState => {
        return {
          ...prevState,
          currentTetrimino: newTetrimino,
          playField: newPlayField 
        } 
      })
      return
    }
    
    // If unsuccessful we clearInterval and setState for locking down the termino.
    clearInterval(this.acquiredState.fallIntervalId)
    setState({
      fallIntervalId: null,
      currentGamePhase: 'lock',
    })

  }
  
  setAcquiredState(stateData) {
    this.acquiredState = stateData
  }
}