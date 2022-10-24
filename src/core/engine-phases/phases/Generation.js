import BasePhase from "./BasePhase.js";
import { NextQueue } from '../../next-queue/NextQueue.js'
import { TetriminoFactory } from '../../tetriminos/TetriminoFactory.js'

export default class Generation extends BasePhase {

  constructor(sharedHandlers) {
    super(sharedHandlers)
    this.nextQueue = new NextQueue()
  }

  execute(appState, setAppState) {
    // console.log('>>> GENERATION PHASE')

    // Dequeue a new tetrimino and instantiate it.
    const tetriminoContext = this.nextQueueHandler.dequeue()
    const nextQueueData = this.nextQueueHandler.queueToArray(5)
    const newTetrimino = TetriminoFactory.getTetrimino(tetriminoContext)
    
    const coordsOffOrigin = newTetrimino.orientations[newTetrimino.currentOrientation].coordsOffOrigin

    const targetStartingCoords = coordsOffOrigin.map(coord => {
      const [vertical, horizontal] = coord
      const [startingVertical, startingHorizontal] = newTetrimino.currentOriginOnPlayfield
      return [startingVertical + vertical, startingHorizontal + horizontal]
    })

    const playField = this.localState.playField
    const newState = this.localState

    if (this.gameIsOver(targetStartingCoords, playField)) {
      newState.currentGamePhase = 'gameOver'
      setAppState(newState)
      return
    }
    
    // Place dequeued tetrimino in playField
    const newPlayfield = this.tetriminoMovementHandler.addTetriminoToPlayField(targetStartingCoords, playField, newTetrimino.minoGraphic)

    // Update swap status in case hold queue has been used
    let { swapStatus } = appState.holdQueue
    if (swapStatus === 'justSwapped') {
      swapStatus = 'swapAvailableNextTetrimino'
    } else if (swapStatus === 'swapAvailableNextTetrimino') {
      swapStatus = 'swapAvailableNow'
    }

    // Update state
    newState.nextQueueData = nextQueueData
    newState.playField = newPlayfield
    newState.currentTetrimino = newTetrimino,
    newState.currentGamePhase = 'falling',
    newState.holdQueue.swapStatus = swapStatus
    
    setAppState(newState)
  }

  gameIsOver(startingOrientationCoords, playField) {
    // Block out - newly-generated tetrimino blocked due to existing block in matrix
    const gridCoordsAreClear = this.tetriminoMovementHandler.gridCoordsAreClear(startingOrientationCoords, playField)
    const gameIsOver = gridCoordsAreClear ? false : true
    return gameIsOver
  }

}