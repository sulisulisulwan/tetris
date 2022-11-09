import BasePhase from "./BasePhase";
import { NextQueue } from '../../next-queue/NextQueue'
import { sharedHandlersIF, coordinates } from "../../../interfaces";

export default class Generation extends BasePhase {

  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
  }

  execute() {
    // console.log('>>> GENERATION PHASE')

    const newTetrimino = this.determineIfNewTetriminoSwappedIn()
    const newTetriminoBaseRowIdx = this.tetriminoMovementHandler.getLowestPlayfieldRowOfTetrimino(newTetrimino)

    const nextQueueData = this.nextQueueHandler.queueToArray(5)
    
    const targetStartingCoords = this.tetriminoMovementHandler.getTetriminoCoordsOnPlayfield(newTetrimino)

    const playfield = this.localState.playfield
    const newState = this.localState

    if (this.gameIsOver(targetStartingCoords, playfield)) {
      newState.currentGamePhase = 'gameOver'
      this.setAppState(newState)
      return
    }
    
    // Place dequeued tetrimino in playfield
    const newPlayfield = this.tetriminoMovementHandler.addTetriminoToPlayfield(targetStartingCoords, playfield, newTetrimino.minoGraphic)

    // Update swap status in case hold queue has been used
    let { swapStatus } = this.localState.holdQueue
    if (swapStatus === 'justSwapped') {
      swapStatus = 'swapAvailableNextTetrimino'
    } else if (swapStatus === 'swapAvailableNextTetrimino') {
      swapStatus = 'swapAvailableNow'
    }

    // Update state
    newState.nextQueue = nextQueueData
    newState.playfield = newPlayfield
    newState.currentTetrimino = newTetrimino,
    newState.currentGamePhase = 'falling',
    newState.lowestLockSurfaceRow = newTetriminoBaseRowIdx
    newState.holdQueue.swapStatus = swapStatus
    newState.extendedLockdownMovesRemaining = 15
    
    this.setAppState(newState)
  }

  gameIsOver(startingOrientationCoords: coordinates[], playfield: string[][]) {
    // Block out - newly-generated tetrimino blocked due to existing block in matrix
    const gridCoordsAreClear = this.tetriminoMovementHandler.gridCoordsAreClear(startingOrientationCoords, playfield)
    const gameIsOver = gridCoordsAreClear ? false : true
    return gameIsOver
  }

  determineIfNewTetriminoSwappedIn() {
    let newTetrimino 

    // if the game just started OR player held for the first time
    if (this.localState.currentTetrimino === null) {
      // Dequeue a new tetrimino and instantiate it.
      newTetrimino = this.nextQueueHandler.dequeue()
    } else if (this.localState.holdQueue.swapStatus === 'justSwapped') {
      newTetrimino = this.localState.currentTetrimino
    }
    return newTetrimino
  }
}