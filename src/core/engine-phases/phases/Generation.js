import BasePhase from "./BasePhase.js";
import { NextQueue } from '../../next-queue/NextQueue.js'

export default class Generation extends BasePhase {

  constructor(sharedHandlers) {
    super(sharedHandlers)
  }

  execute() {
    // console.log('>>> GENERATION PHASE')

    const newTetrimino = this.determineIfNewTetriminoSwappedIn()
    
    const nextQueueData = this.nextQueueHandler.queueToArray(5)
    
    const targetStartingCoords = this.tetriminoMovementHandler.getTetriminoCoordsOnPlayfield(newTetrimino)
    // const targetStartingCoords = coordsOffOrigin.map(coord => {
    //   const [vertical, horizontal] = coord
    //   const [startingVertical, startingHorizontal] = newTetrimino.currentOriginOnPlayfield
    //   return [startingVertical + vertical, startingHorizontal + horizontal]
    // })

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
    newState.holdQueue.swapStatus = swapStatus
    
    this.setAppState(newState)
  }

  gameIsOver(startingOrientationCoords, playfield) {
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