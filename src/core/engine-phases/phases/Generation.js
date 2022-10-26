import BasePhase from "./BasePhase.js";
import { NextQueue } from '../../next-queue/NextQueue.js'
import { TetriminoFactory } from '../../tetriminos/TetriminoFactory.js'

export default class Generation extends BasePhase {

  constructor(sharedHandlers) {
    super(sharedHandlers)
    this.nextQueue = new NextQueue()
  }

  execute() {
    // console.log('>>> GENERATION PHASE')

    // Dequeue a new tetrimino and instantiate it.
    const tetriminoContext = this.nextQueueHandler.dequeue()
    const nextQueueData = this.nextQueueHandler.queueToArray(5)

    const newTetrimino = swapStatus ===  'justSwapped' ? this.localState.holdQueue.heldTetrimino
      : TetriminoFactory.getTetrimino(tetriminoContext)
    
    const coordsOffOrigin = newTetrimino.orientations[newTetrimino.currentOrientation].coordsOffOrigin

    const targetStartingCoords = coordsOffOrigin.map(coord => {
      const [vertical, horizontal] = coord
      const [startingVertical, startingHorizontal] = newTetrimino.currentOriginOnPlayfield
      return [startingVertical + vertical, startingHorizontal + horizontal]
    })

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
    newState.nextQueueData = nextQueueData
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

}