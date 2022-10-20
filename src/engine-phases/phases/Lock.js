import BasePhase from "./BasePhase.js";
import { makeCopy, gridCoordsAreClear, offsetCoordsToLineBelow } from "../../utils/utils.js";
import { TetriminoMovementHandler } from "../../components/tetriminos/TetriminoMovementHandler.js";

export default class Lock extends BasePhase {

  constructor() {
    super()
    this.tetriminoMovementHandler = new TetriminoMovementHandler()
    this.acquiredState = null
  }

  execute(stateData, setState) {
    console.log('>>>> LOCK PHASE')

    this.setAcquiredState(stateData)
    // Player can still alter the the tetrimino's position and orientation.
    // Everytime player alters tetrimino position and orientation, lockPhase runs and checks if
    //classic rules for lock: setTimeout for lock. 0.5 seconds unless player moves termino to a position which can fall

    //TODO:note: using the Super Rotation System, rotating a tetrimino often causes the y-coordinate of the tetrimino to increase, 
    //i.e., it “lifts up” off the Surface it landed on. the Lock down timer does not reset in this case, but it does stop 
    //counting down until the tetrimino lands again on a Surface that has the same (or higher) y-coordinate as it did before 
    //it was rotated. only if it lands on a Surface with a lower y-coordinate will the timer reset.

    // TODO: ensure these are copies
    
    if (!stateData.lockIntervalId) {
      setState({
        lockIntervalId: setTimeout(this.lockDownTimeout.bind(this), 500, setState)
      })
      return
    }

    const tetriminoCopy = makeCopy(this.acquiredState.currentTetrimino)
    let playFieldCopy = this.acquiredState.playField

    const oldCoordsOnPlayfield = []
    const targetCoordsOnPlayfield = []

    const oldCoordsOffOrigin = tetriminoCopy.orientations[tetriminoCopy.currentOrientation].coordsOffOrigin

    for (let i = 0; i < oldCoordsOffOrigin.length; i += 1) {
      const { oldCoordOnPlayfield, targetCoordOnPlayfield } = this.tetriminoMovementHandler.down(tetriminoCopy, i)
      oldCoordsOnPlayfield.push(oldCoordOnPlayfield)
      targetCoordsOnPlayfield.push(targetCoordOnPlayfield)
    }

    playFieldCopy = this.tetriminoMovementHandler.clearTetriminoFromPlayField(oldCoordsOnPlayfield, playFieldCopy)

    if (gridCoordsAreClear(targetCoordsOnPlayfield, playFieldCopy)) {
      this.tetriminoMovementHandler.addTetriminoToPlayField(oldCoordsOnPlayfield, playFieldCopy, tetriminoCopy.minoGraphic)

      clearTimeout(stateData.lockIntervalId)
      setState({
        currentGamePhase: 'falling',
        lockIntervalId: null
      })
    }
    // Otherwise, the timer runs out and we continue to pattern phase
    
  }

  lockDownTimeout(setState) {

    clearTimeout(this.acquiredState.lockIntervalId)
    const tetriminoCopy = makeCopy(this.acquiredState.currentTetrimino)
    let playFieldCopy = this.acquiredState.playField

    const oldCoordsOnPlayfield = []
    const targetCoordsOnPlayfield = []

    const oldCoordsOffOrigin = tetriminoCopy.orientations[tetriminoCopy.currentOrientation].coordsOffOrigin

    for (let i = 0; i < oldCoordsOffOrigin.length; i += 1) {
      const { oldCoordOnPlayfield, targetCoordOnPlayfield } = this.tetriminoMovementHandler.down(tetriminoCopy, i)
      oldCoordsOnPlayfield.push(oldCoordOnPlayfield)
      targetCoordsOnPlayfield.push(targetCoordOnPlayfield)
    }

    playFieldCopy = this.tetriminoMovementHandler.clearTetriminoFromPlayField(oldCoordsOnPlayfield, playFieldCopy)

    if(gridCoordsAreClear(targetCoordsOnPlayfield, playFieldCopy)) {
      this.tetriminoMovementHandler.addTetriminoToPlayField(oldCoordsOnPlayfield, playFieldCopy, tetriminoCopy.minoGraphic)
      
      setState({
        currentGamePhase: 'falling',
        lockIntervalId: null,
      })
      return
    }

    this.tetriminoMovementHandler.addTetriminoToPlayField(oldCoordsOnPlayfield, playFieldCopy, tetriminoCopy.minoGraphic)
    tetriminoCopy.status = 'locked'

    setState({
      currentGamePhase: 'pattern',
      lockIntervalId: null,
      currentTetrimino: tetriminoCopy,
    })
  }



  setAcquiredState(stateData) {
    this.acquiredState = stateData
  }
}